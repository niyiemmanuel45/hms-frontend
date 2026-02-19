import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patients-show',
  templateUrl: './patients-show.component.html',
  styleUrls: ['./patients-show.component.css']
})
export class PatientsShowComponent {
  user: User = new User();
  userRoleStatus: string;
  details: ICurrentUser[];
  useId: string;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private acct: AccountService){}

  activateForm = this.formBuilder.group({

  });
  blockForm = this.formBuilder.group({

  });
  resendForm = this.formBuilder.group({

  });
  resetForm = this.formBuilder.group({

  });

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      // console.log(this.user);
      this.useId = this.user.userId;
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  activate(id: string){
    this.userService.activateUser(id).subscribe(
      data => {
        const result = data;
        this.toastr.success("User account activated successfully");
        this.router.navigate(['/feed/users/show', this.useId]);
      }, error => {
        this.toastr.error(error.message);
        this.router.navigate(['/feed/users/show', this.useId]);
      }
    );
  }

  blockNUnblockUser(id: string){
    this.userService.BlockUserAccount(id).subscribe(
      data => {
        const result = data;
        this.toastr.success(result.responseData);
        this.router.navigate(['/feed/users/show', this.useId]);
      }, error => {
        this.toastr.error(error.message);
        this.router.navigate(['/feed/users/show', this.useId]);
      }
    );
  }

  ResendConfirmationLink(id: string){
    this.userService.ResendLink(id).subscribe(
      data => {
        const result = data;
        // console.log(result);
        this.toastr.success(result.message);
        this.router.navigate(['/feed/users/show', this.useId]);
      }, error => {
        this.toastr.error(error.error.message);
        this.router.navigate(['/feed/users/show', this.useId]);
      }
    );
  }

  ResetPassword(id: string){
    // console.log('Id ' + id);
    this.userService.ResetPassword(id).subscribe(
      data => {
        const result = data;
        // console.log(result);
        this.toastr.success("Password has been reset to default successfully");
        this.router.navigate(['/feed/users/show', this.useId]);
      }, error => {
        this.toastr.error(error.error.message);
        this.router.navigate(['/feed/users/show', this.useId]);
      }
    );
  }
}
