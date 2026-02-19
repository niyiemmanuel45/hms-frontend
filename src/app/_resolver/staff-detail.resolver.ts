import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { StaffService } from "../services/staff.service";
import { Staff } from "../models/staff";

@Injectable({
  providedIn: 'root'
})
export class StaffDetailResolver implements Resolve<Staff> {

  constructor(private userService: StaffService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Staff> {
    //debugger;
    let id: string = route.params['id']
    return this.userService.getStaffById(id).pipe(catchError(error => {
        this.toaster.error('Problem retrieving data');
        this.router.navigate(['/']);
        return EMPTY;
    }));
  }
}
