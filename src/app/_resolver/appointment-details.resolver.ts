import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { Appointment } from '../models/appointment';
import { AppointmentService } from "../services/appointment.service";

@Injectable({
  providedIn: 'root'
})
export class AppointmentDetailsResolver implements Resolve<Appointment> {

  constructor(private userService: AppointmentService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Appointment> {
    //debugger;
    let id: number = route.params['id']
    return this.userService.GetById(id).pipe(catchError(error => {
        this.toaster.error('Problem retrieving data');
        this.router.navigate(['/']);
        return EMPTY;
    }));
  }
}
