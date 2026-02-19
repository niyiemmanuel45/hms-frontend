import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { Prescription } from "../models/prescription";
import { PrescriptionService } from "../services/prescription.service";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionDetailResolver implements Resolve<Prescription> {

  constructor(private userService: PrescriptionService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Prescription> {
    //debugger;
    let id: number = route.params['tid']
    return this.userService.GetById(id).pipe(catchError(error => {
        this.toaster.error('Problem retrieving data');
        this.router.navigate(['/']);
        return EMPTY;
    }));
  }
}
