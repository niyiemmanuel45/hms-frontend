import { Component } from '@angular/core';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { SingleResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { HospitalService } from 'src/app/services/hospital.service';

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
    this.GetLogo(strArr[5]);
  }

  GetLogo(code: string){
    this.hospitalServ.GetByCode(code).subscribe((res: SingleResult<Hospital>) => {
      if(res.requestSuccessful){
        this.logoUrl = res.responseData.logoURL;
      }
    }, error => {
      if(error.length > 0){
        for(let err in error){
          console.log(error[err]);
        }
      }else{
        console.log(error);
      }
    });
  }
  onLogout() {
    this.acct.logout();
  }
}
