import { Component } from '@angular/core';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { AccountService } from 'src/app/services/account.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userRoleStatus : string;
  logoUrl : string;
  details: ICurrentUser[];

  constructor(public acct: AccountService, private hospitalServ: HospitalService) { }

  ngOnInit():void {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
    this.GetLogoFromUserDetails();
  }

  GetLogoFromUserDetails() {
    // Try to get the current user details to extract hospital logo
    this.acct.currentUser$.subscribe((user: User | null) => {
      if (user && user.hospital && user.hospital.name) {
        // Use hospital logo if available, otherwise use default
        this.logoUrl = user.hospital.logoURL || '/assets/admin/admintemplates/img/carelogo.jpg';
        console.log('Using hospital logo:', this.logoUrl);
      } else if (user && user.tenantId) {
        // If no hospital data but we have tenantId, try to fetch hospital data
        this.GetHospitalByTenantId(user.tenantId);
      } else {
        // Fallback to default logo
        this.logoUrl = '/assets/admin/admintemplates/img/carelogo.jpg';
        console.log('Using default logo');
      }
    });
  }

  GetHospitalByTenantId(tenantId: string) {
    // fetch the hospital for the tenant and use its logo (falls back to the default)
    this.hospitalServ.GetByTenant(tenantId).subscribe(response => {
      const hospitals = response?.responseData?.items || [];
      const hospital = hospitals[0];
      this.logoUrl = hospital && hospital.logoURL ? hospital.logoURL : '/assets/admin/admintemplates/img/carelogo.jpg';
    }, error => {
      this.logoUrl = '/assets/admin/admintemplates/img/carelogo.jpg';
    });
  }

  onLogout() {
    this.acct.logout();
  }
}
