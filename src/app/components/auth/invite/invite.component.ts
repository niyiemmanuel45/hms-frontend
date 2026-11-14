import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  success = false;
  errorMessage = '';

  userId = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || '';
      this.token = params['token'] || '';
      if (!this.userId || !this.token) {
        this.errorMessage = 'This invite link is missing its token. Ask your administrator to send a fresh invitation.';
      }
    });
  }

  passwordsMatch(group: FormGroup) {
    const pw = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading || !this.userId || !this.token) return;

    this.isLoading = true;
    this.errorMessage = '';

    const data = new FormData();
    data.append('userId', this.userId);
    data.append('token', this.token);
    data.append('password', this.form.value.password);

    this.http.post(`${environment.apiUrl}api/Tenant/accept-invite`, data, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.success = true;
          this.isLoading = false;
          this.toastr.success('Your account has been activated. You can now sign in.');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: err => {
          this.isLoading = false;
          this.errorMessage =
            (err?.error && (typeof err.error === 'string' ? err.error : err.error.message)) ||
            'Activation failed. The link may be invalid or expired.';
        },
      });
  }
}
