import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, take, map } from 'rxjs';
import { ICurrentUser } from '../models/icurrent-user';
import { AccountService } from '../services/account.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardGuard {
  userRoleStatus: string;
  details: ICurrentUser[];

  constructor(private acct : AccountService,
              private router: Router,
              private toastr: ToastrService){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {

      return this.acct.isLoggesIn.pipe(take(1), map((loginStatus : boolean) =>
      {
        const destination: string = state.url;
        const id = route.paramMap.get('id');
        const tid = route.paramMap.get('tid');

        this.details = this.acct.TokenDecodeUserDetail();
        var strArr = this.details.map(function(e){return e.toString()});
        this.userRoleStatus = strArr[4];

        // To check if user is not logged in
        if(!loginStatus)
        {
          this.toastr.error('You need to log in to access this area!');
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
        // if the user is already logged in
        switch(destination)
        {
          case '/feed':
          case '/feed/profile/'+id:
          case '/feed/edit-profile/'+id:
          case '/feed/change-avatar/'+id:
          case '/feed/audit':
          case '/feed/department':
          case '/feed/blood-bank':
          case '/feed/category':
          case '/feed/hospital':
          case '/feed/hospital/create':
          case '/feed/hospital/config/'+id:
          case '/feed/hospital/edit/'+id:
          case '/feed/users/add-user/'+id:
          case '/feed/beneficiary/'+id:
          case '/feed/admin-users/'+id:
          case '/feed/patients/'+id:
          case '/feed/nurses/'+id:
          case '/feed/doctors/'+id:
          case '/feed/staffs/'+id:
          case '/feed/staffs/add/'+id:
          case '/feed/staffs/show/'+id:
          case '/feed/staffs/edit/'+id:
          case '/feed/users/show/'+id:
          case '/feed/patient/show/'+id:
          case '/feed/lga/'+id:
          case '/feed/hospital/logo/'+id:
          case '/feed/cities/'+id:
          case '/feed/lga/logo/'+id+'/'+tid:
          case '/feed/invoice-settings/'+id:
          case '/feed/test-type/'+id:
          case '/feed/medicine/'+id:
          case '/feed/bed/'+id:
          case '/feed/donor/'+id:
          case '/feed/patient/appointment/'+id:
          case '/feed/nurses/appointment/'+id:
          case '/feed/doctors/appointment/'+id:
          case '/feed/appointment/'+id:
          case '/feed/patient-avatar/'+id:
          case '/feed/patient/bed-allotment/'+id+'/'+tid:
          case '/feed/patient/cases/'+id:
          case '/feed/patient/lab-report/'+id:
          case '/feed/patient/bills/'+id:
          case '/feed/patient/lab-result-upload/'+id+'/'+tid:
          case '/feed/prescription/'+id:
          case '/feed/prescription/create/'+id:
          case '/feed/prescription/details/'+id+'/'+tid:
          case '/feed/patient/transactions/'+id:
          case '/feed/transactions':
          {
            if (this.userRoleStatus === "client_user" || this.userRoleStatus === "client_admin"
              || this.userRoleStatus === "tenant" || this.userRoleStatus === "power_user" ||
              this.userRoleStatus === "doctor" || this.userRoleStatus === "nurse" ||
              this.userRoleStatus === "accountant" || this.userRoleStatus === "receptionist") {
              return true;
            }
          }
          case '/feed/settings':
          case '/feed/cryptography':
          case '/feed/users':
          case '/feed/role':
          {
            if (this.userRoleStatus === "client_user" || this.userRoleStatus === "client_admin" || this.userRoleStatus == "tenant") {
              this.router.navigate(['/access-denied'])
              return false;
            }
            if (this.userRoleStatus === "power_user") {
              return true;
            }
          }
          default:
            return false;
        }
      }));
    }
}
