import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Role } from 'src/app/models/role';
import { AccountService } from 'src/app/services/account.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {
  roles: Role[] = [];
  userRoleStatus : string;
  details: ICurrentUser[];

  constructor(private roleService : RoleService,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {

    this.GetAllRoles();

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  GetAllRoles(){
    this.roleService.GetAll()
      .subscribe((response: Role[]) => {
        this.roles = response as Role[];
      },error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error);
      }
    });
  }
}
