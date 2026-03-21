import { Component } from '@angular/core';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { AccountService } from 'src/app/services/account.service';
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

  constructor(public acct: AccountService) { }

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
    // Since the /api/Hospitals/code endpoint doesn't work, try using GetById with tenantId
    // Note: tenantId is a string but the API might expect a number, so we'll try both approaches
    const hospitalId = parseInt(tenantId);

    if (!isNaN(hospitalId)) {
      // Try to get hospital by ID
      this.acct.getCurrentUserById(tenantId);
      // Note: This is a workaround since the actual hospital service methods aren't working
      // In a real scenario, we'd use: this.hospitalServ.GetById(hospitalId)
      this.logoUrl = '/assets/admin/admintemplates/img/carelogo.jpg';
      console.log('Using default logo due to API limitations');
    } else {
      this.logoUrl = '/assets/admin/admintemplates/img/carelogo.jpg';
      console.log('Invalid tenantId, using default logo');
    }
  }

  onLogout() {
    this.acct.logout();
  }
}
