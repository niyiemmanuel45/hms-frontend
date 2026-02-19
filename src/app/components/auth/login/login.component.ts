import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { ScriptLoaderService } from 'src/app/services/shared/script-loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  insertForm: FormGroup;
  Email: FormControl;
  Password: FormControl;
  returnUrl: string;
  ErrorMessage: string;
  invalidLogin: boolean;

  isLoading = false;

  constructor (
    private acct: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastrService,
    private scriptLoader: ScriptLoaderService) {}

  onSubmit() {
    this.isLoading = true;
    let userlogin = this.insertForm.value;
    this.acct.login(userlogin.Email, userlogin.Password).subscribe(result => {
      //if authentication is successful
      let token = (<any>result).tokenString;
      this.toast.success("You've loggedln successfully", "Welcome Back!");
      this.invalidLogin = false;
      // console.log(this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    },
    error => {
      this.invalidLogin = true;
      this.isLoading = false;
      // console.log(error);
      // console.log(error.error.message);
      this.toast.error(error.error.message);
    })
  }

  ngOnInit(): void {
    // Load login-specific styles and scripts
    this.scriptLoader.loadStyles([
      'http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all',
      'assets/global/plugins/font-awesome/css/font-awesome.min.css',
      'assets/global/plugins/simple-line-icons/simple-line-icons.min.css',
      'assets/global/plugins/bootstrap/css/bootstrap.min.css',
      'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
      'assets/global/plugins/select2/css/select2.min.css',
      'assets/global/plugins/select2/css/select2-bootstrap.min.css',
      'assets/global/css/components.min.css',
      'assets/global/css/plugins.min.css',
      'assets/pages/css/login-5.min.css',
    ]);
    this.scriptLoader.loadScripts([
      'assets/global/plugins/jquery.min.js',
      'assets/global/plugins/bootstrap/js/bootstrap.min.js',
      'assets/global/plugins/js.cookie.min.js',
      'assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
      'assets/global/plugins/jquery.blockui.min.js',
      'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
      'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
      // 'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
      'assets/global/plugins/select2/js/select2.full.min.js',
      'assets/global/plugins/backstretch/jquery.backstretch.min.js',
      'assets/global/scripts/app.min.js',
      'assets/pages/scripts/login-5.min.js',
    ]);


    // Initialize Form Controls
    this.Email = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Initialize FormGroup using FormBuilder
    this.insertForm = this.fb.group({
      "Email": this.Email,
      "Password": this.Password
    });
  }

  ngOnDestroy(): void {
    // Unload login-specific styles and scripts
    this.scriptLoader.removeStyles([
      'http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all',
      'assets/global/plugins/font-awesome/css/font-awesome.min.css',
      'assets/global/plugins/simple-line-icons/simple-line-icons.min.css',
      'assets/global/plugins/bootstrap/css/bootstrap.min.css',
      'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
      'assets/global/plugins/select2/css/select2.min.css',
      'assets/global/plugins/select2/css/select2-bootstrap.min.css',
      'assets/global/css/components-md.min.css',
      'assets/global/css/plugins-md.min.css',
      'assets/pages/css/login-5.min.css',
    ]);
    this.scriptLoader.removeScripts([
      'assets/global/plugins/jquery.min.js',
      'assets/global/plugins/bootstrap/js/bootstrap.min.js',
      'assets/global/plugins/js.cookie.min.js',
      'assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
      'assets/global/plugins/jquery.blockui.min.js',
      'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
      'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
      'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
      'assets/global/plugins/select2/js/select2.full.min.js',
      'assets/global/plugins/backstretch/jquery.backstretch.min.js',
      'assets/global/scripts/app.min.js',
      'assets/pages/scripts/login-5.min.js',
    ]);
  }
}
