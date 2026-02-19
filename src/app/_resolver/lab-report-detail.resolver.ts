import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { LabReport } from "../models/test-type";
import { TestTypeService } from "../services/test-type.service";

@Injectable({
  providedIn: 'root'
})
export class LabReportDetailResolver implements Resolve<LabReport> {

  constructor(private testService: TestTypeService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<LabReport> {
    //debugger;
    let id: number = route.params['tid'];
    return this.testService.LabReportById(id).pipe(catchError(error => {
        this.toaster.error('Problem retrieving data');
        this.router.navigate(['/']);
        return EMPTY;
    }));
  }
}
