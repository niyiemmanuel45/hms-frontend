import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { User } from "../models/user";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserDetailResolver implements Resolve<User> {

  constructor(private userService: UserService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    //debugger;
    let id: string = route.params['id']
    return this.userService.getUserById(id).pipe(catchError(error => {
        this.toaster.error('Problem retrieving data');
        this.router.navigate(['/']);
        return EMPTY;
    }));
  }
}
