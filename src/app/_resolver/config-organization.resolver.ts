import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { Hospital } from "../models/hospital";
import { HospitalService } from "../services/hospital.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigOrganizationResolver implements Resolve<Hospital> {

  constructor(private orgService: HospitalService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Hospital> {
      //debugger;
      let id: number = route.params['id']
      return this.orgService.GetById(id).pipe(catchError(error => {
          this.toaster.error('Problem retrieving data');
          this.router.navigate(['/']);
          return EMPTY;
      }));
  }
}
