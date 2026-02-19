import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserService } from './user.service';
import { ICurrentUser } from '../models/icurrent-user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  helper = new JwtHelperService();
  baseUrl = environment.apiUrl;

  currentUser: User = new User();
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  // Url to access our Web API’s
  private baseUrlLogin : string = "api/Account/auth";
  // User related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());

  constructor(private http : HttpClient,
    private router : Router,
    private userService: UserService,
    private toast: ToastrService) { }

  //Login Method
  login(username: string, password: string)
  {
    const grantType = "authenticate";
    // pipe() let you combine multiple functions into a single function.
    // pipe() runs the composed functions in sequence.
    return this.http.post<any>(this.baseUrl + this.baseUrlLogin, {username, password, grantType}, httpOptions).pipe(
      map(result => {
        // login successful if there's a jwt token in the response
        if(result && result.access_token!.token)
        {
          this.currentUser = result.user_details;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.access_token.token);
          localStorage.setItem('refreshToken', result.access_token.refresh_token);
          this.setCurrentUser(this.currentUser);
        }
        return result;
      })
    );
  }

  getCurrentUserById(userId: string) {
    this.userService.getUserById(userId)
      .subscribe((response: User) => {
        this.currentUser = response;
        this.currentUserSource.next(this.currentUser);
    });
  }

  setCurrentUser(user: User) {
    const details = this.TokenDecodeUserDetail();
    var strArr = details.map(function(e){return e.toString()});
    this.userService.getUserById(strArr[0])
      .subscribe((response: User) => {
        user = response;
        this.currentUserSource.next(user);
    });
  }
  // Method to get new refresh token
  getNewRefreshToken() : Observable<any>
  {
    let details = this.TokenDecodeUserDetail();
    var strArr = details.map(function(e){return e.toString()});
    let username = strArr[2];
    let refreshToken = localStorage.getItem('refreshToken');
    const grantType = "refresh_token";
    return this.http.post<any>(this.baseUrl + this.baseUrlLogin, {username, refreshToken, grantType}, httpOptions).pipe(
        map(result => {
            if(result && result.access_token.token)
            {
              this.loginStatus.next(true);
              localStorage.setItem('loginStatus', '1');
              localStorage.setItem('jwt', result.access_token.token);
              localStorage.setItem('refreshToken', result.access_token.refresh_token);
            }
            return <any>result;
        })
    );
  }

  logout()
  {
    // Set Loginstatus to false and delete saved jwt cookie
    this.loginStatus.next(false);
    localStorage.setItem('loginStatus', '0');
    localStorage.removeItem('expire');
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    // this.toast.success("See you some other time", "Goodbye");
    this.router.navigate(['/login']);
  }

  checkLoginStatus() : boolean
  {
    var loginCookie = localStorage.getItem("loginStatus");

    if(loginCookie == "1")
    {
      if(localStorage.getItem('jwt') != null || localStorage.getItem('jwt') != undefined)
      {
        return true;
      }
    }
    return false;
  }

  get isLoggesIn()
  {
    return this.loginStatus.asObservable();
  }

  public TokenDecodeUserDetail(): ICurrentUser[] {
    const persons: ICurrentUser[] = [];
    const token = localStorage.getItem('jwt');
    if(token !== null){
      const decode = this.helper.decodeToken(token ?? '{}');
      persons.push(decode.nameid, decode.email, decode.given_name, decode.unique_name, decode.role, decode.tenantid);
      return persons;
    }
    this.router.navigate(['/login']);
    return persons;
  }
}
