import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isTokenRefreshing: boolean = false;

  // helper = new JwtHelperService();

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null!);

  constructor (private router: Router, private acct : AccountService, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check if the user is logging in for the first time
    return next.handle(this.attachTokenToRequest(request)).pipe(
      // catchError((error) =>
      catchError((error) : Observable<any> =>
      {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat();
              } else {
                this.toastr.error(error.error.message, error.status.toString())
              }
              break;
            case 403:
              this.toastr.error('Forbidden', error.status.toString());
              this.router.navigateByUrl('/access-denied');
              break;
            case 401:
              console.log("Session destroyed ...");
              this.toastr.error('Session destroyed', error.status.toString());
              return <any>this.acct.logout();
              // console.log("Token expired. Attempting refresh ...");
              // return this.handleHttpResponseError(request, next);
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              this.toastr.error(error.error.message, error.status.toString());
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(() => error);
      })
    );
  }

  private attachTokenToRequest(request: HttpRequest<any>)
  {
    var token = localStorage.getItem('jwt');
    return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
  }
}
