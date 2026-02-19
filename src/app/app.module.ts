import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { MasterComponent } from './components/layouts/master/master.component';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { BreadcumbComponent } from './components/layouts/breadcumb/breadcumb.component';
import { FeedComponent } from './components/home/feed/feed.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { AppSettingsComponent } from './components/settings/app-settings/app-settings.component';
import { SiteCryptographyComponent } from './components/settings/site-cryptography/site-cryptography.component';
import { BeneficiaryComponent } from './components/organization/beneficiary/beneficiary.component';
import { OrgListComponent } from './components/organization/org-list/org-list.component';
import { OrgEditComponent } from './components/organization/org-edit/org-edit.component';
import { OrgConfigComponent } from './components/organization/org-config/org-config.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { AccessDeniedComponent } from './components/errors/access-denied/access-denied.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { TimeagoModule } from 'ngx-timeago';
import { TokenInterceptor } from './_helper/TokenInterceptor';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { AuditsComponent } from './components/audits/audits.component';
import { OrgLogoComponent } from './components/organization/org-logo/org-logo.component';
import { CityComponent } from './components/organization/city/city.component';
import { LgaComponent } from './components/organization/lga/lga.component';
import { LgaLogoComponent } from './components/organization/lga-logo/lga-logo.component';
import { InvoiceSettingsComponent } from './components/organization/invoice-settings/invoice-settings.component';
import { AdminUsersComponent } from './components/users/admin-users/admin-users.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { EditProfileComponent } from './components/users/edit-profile/edit-profile.component';
import { ChangeAvatarComponent } from './components/users/change-avatar/change-avatar.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { PatientsComponent } from './components/users/patients/patients.component';
import { RoleComponent } from './components/role/role.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { StaffListComponent } from './components/staff/staff-list/staff-list.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { OrgCreateComponent } from './components/organization/org-create/org-create.component';
import { StaffShowComponent } from './components/staff/staff-show/staff-show.component';
import { StaffAddComponent } from './components/staff/staff-add/staff-add.component';
import { StaffEditComponent } from './components/staff/staff-edit/staff-edit.component';
import { DoctorsComponent } from './components/staff/doctors/doctors.component';
import { NursesComponent } from './components/staff/nurses/nurses.component';
import { PatientsShowComponent } from './components/users/patients-show/patients-show.component';
import { BloodBankComponent } from './components/blood-bank/blood-bank.component';
import { CategoryComponent } from './components/category/category.component';
import { TestTypeComponent } from './components/laboratory/test-type/test-type.component';
import { LabReportPatientComponent } from './components/laboratory/lab-report-patient/lab-report-patient.component';
import { MedicineHospitalComponent } from './components/medicine/medicine-hospital/medicine-hospital.component';
import { MedicineListComponent } from './components/medicine/medicine-list/medicine-list.component';
import { BedAllotmentComponent } from './components/bed/bed-allotment/bed-allotment.component';
import { BedComponent } from './components/bed/bed/bed.component';
import { DonorComponent } from './components/donor/donor.component';
import { CaseComponent } from './components/case/case.component';
import { LabResultUploadComponent } from './components/laboratory/lab-result-upload/lab-result-upload.component';
import { PatientsLogoComponent } from './components/users/patients-logo/patients-logo.component';
import { PatientListComponent } from './components/appointments/patient-list/patient-list.component';
import { DoctorListComponent } from './components/appointments/doctor-list/doctor-list.component';
import { NurseListComponent } from './components/appointments/nurse-list/nurse-list.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { IndividualComponent } from './components/appointments/individual/individual.component';
import { PrescriptionListComponent } from './components/drugs/prescription-list/prescription-list.component';
import { PrescriptionAddComponent } from './components/drugs/prescription-add/prescription-add.component';
import { PrescriptionEditComponent } from './components/drugs/prescription-edit/prescription-edit.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { BillsComponent } from './components/transactions/bills/bills.component';
import { PatientTransactionComponent } from './components/transactions/patient-transaction/patient-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    MasterComponent,
    NavbarComponent,
    BreadcumbComponent,
    FeedComponent,
    ForgotPasswordComponent,
    AppSettingsComponent,
    SiteCryptographyComponent,
    BeneficiaryComponent,
    OrgListComponent,
    OrgEditComponent,
    OrgConfigComponent,
    NotFoundComponent,
    AccessDeniedComponent,
    ServerErrorComponent,
    AuditsComponent,
    OrgLogoComponent,
    CityComponent,
    LgaComponent,
    LgaLogoComponent,
    InvoiceSettingsComponent,
    AdminUsersComponent,
    ProfileComponent,
    EditProfileComponent,
    ChangeAvatarComponent,
    AddUserComponent,
    EditUserComponent,
    PatientsComponent,
    RoleComponent,
    UserListComponent,
    StaffListComponent,
    DepartmentsComponent,
    OrgCreateComponent,
    StaffShowComponent,
    StaffAddComponent,
    StaffEditComponent,
    DoctorsComponent,
    NursesComponent,
    PatientsShowComponent,
    BloodBankComponent,
    CategoryComponent,
    TestTypeComponent,
    LabReportPatientComponent,
    MedicineHospitalComponent,
    MedicineListComponent,
    BedAllotmentComponent,
    BedComponent,
    DonorComponent,
    CaseComponent,
    LabResultUploadComponent,
    PatientsLogoComponent,
    PatientListComponent,
    DoctorListComponent,
    NurseListComponent,
    IndividualComponent,
    PrescriptionListComponent,
    PrescriptionAddComponent,
    PrescriptionEditComponent,
    BillsComponent,
    TransactionListComponent,
    PatientTransactionComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TimeagoModule.forRoot(),
    NgxPaginationModule,
    FullCalendarModule 
  ],
  providers: [
    AuthGuardGuard, DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
