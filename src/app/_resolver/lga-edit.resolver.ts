import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, EMPTY } from "rxjs";
import { Lga } from "../models/city";
import { CountryService } from "../services/country.service";

@Injectable({
  providedIn: 'root'
})
export class LgaEditResolver implements Resolve<Lga> {

  constructor(private countryService: CountryService,
              private router: Router,
              private toaster: ToastrService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Lga> {
      //debugger;
      let id: number = route.params['id']
      return this.countryService.getLGAById(id).pipe(catchError(error => {
          this.toaster.error('Problem retrieving data');
          this.router.navigate(['/']);
          return EMPTY;
      }));
  }
}
