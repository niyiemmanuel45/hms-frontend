import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePassword } from 'src/app/viewModel/change-password';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: User = new User();
  userRoleStatus: string;
  details: ICurrentUser[];
  changePassword : ChangePassword;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private acct: AccountService){}

    insertForm: FormGroup;
    newPassword: FormControl;
    confirmNewPassword: FormControl;
    currentPassword: FormControl;

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    //reset password
    this.currentPassword = new FormControl('', [Validators.required]);
    this.newPassword = new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(4)]);
    this.confirmNewPassword = new FormControl('', [Validators.required, this.MustMatch(this.newPassword)]);
    this.insertForm = this.fb.group(
    {
      'currentPassword': this.currentPassword,
      'newPassword': this.newPassword,
      'confirmNewPassword': this.confirmNewPassword
    });
  }

  onSubmit() {
    // console.log(this.insertForm.value);
    this.changePassword = this.insertForm.value;
    this.userService.changePassword(this.user.userId, this.changePassword).subscribe(() => {
      this.toastr.success('Password Changed Successfully');
      this.router.navigate(['/feed/profile', this.user.userId]);
      window.location.reload();
    }, error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error);
      }
    });
  }

  // Custom Validator
  MustMatch(passwordControl: AbstractControl): ValidatorFn {
    return (cpasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialised yet
      if (!passwordControl && !cpasswordControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (cpasswordControl.hasError && !passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (passwordControl.value !== cpasswordControl.value) {
        return { 'mustMatch': true };
      }
      else {
        return null;
      }
    }
  }
}
