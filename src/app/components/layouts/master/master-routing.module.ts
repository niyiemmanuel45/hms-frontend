import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { FeedComponent } from '../../home/feed/feed.component';
import { AuthGuardGuard } from 'src/app/guards/auth-guard.guard';
import { AuditsComponent } from '../../audits/audits.component';
import { OrgListComponent } from '../../organization/org-list/org-list.component';
import { OrgConfigComponent } from '../../organization/org-config/org-config.component';
import { ConfigOrganizationResolver } from 'src/app/_resolver/config-organization.resolver';
import { CityComponent } from '../../organization/city/city.component';
import { BeneficiaryComponent } from '../../organization/beneficiary/beneficiary.component';
import { LgaComponent } from '../../organization/lga/lga.component';
import { LgaLogoComponent } from '../../organization/lga-logo/lga-logo.component';
import { LgaEditResolver } from 'src/app/_resolver/lga-edit.resolver';
import { OrgLogoComponent } from '../../organization/org-logo/org-logo.component';
import { OrgEditComponent } from '../../organization/org-edit/org-edit.component';
import { RoleComponent } from '../../role/role.component';
import { SiteCryptographyComponent } from '../../settings/site-cryptography/site-cryptography.component';
import { AppSettingsComponent } from '../../settings/app-settings/app-settings.component';
import { InvoiceSettingsComponent } from '../../organization/invoice-settings/invoice-settings.component';
import { UserListComponent } from '../../users/user-list/user-list.component';
import { EditUserComponent } from '../../users/edit-user/edit-user.component';
import { AddUserComponent } from '../../users/add-user/add-user.component';
import { AdminUsersComponent } from '../../users/admin-users/admin-users.component';
import { ProfileComponent } from '../../users/profile/profile.component';
import { EditProfileComponent } from '../../users/edit-profile/edit-profile.component';
import { ChangeAvatarComponent } from '../../users/change-avatar/change-avatar.component';
import { UserDetailResolver } from 'src/app/_resolver/user-detail.resolver';
import { PatientsComponent } from '../../users/patients/patients.component';
import { StaffListComponent } from '../../staff/staff-list/staff-list.component';
import { OrgCreateComponent } from '../../organization/org-create/org-create.component';
import { StaffShowComponent } from '../../staff/staff-show/staff-show.component';
import { StaffAddComponent } from '../../staff/staff-add/staff-add.component';
import { StaffEditComponent } from '../../staff/staff-edit/staff-edit.component';
import { StaffDetailResolver } from 'src/app/_resolver/staff-detail.resolver';
import { DoctorsComponent } from '../../staff/doctors/doctors.component';
import { NursesComponent } from '../../staff/nurses/nurses.component';
import { PatientsShowComponent } from '../../users/patients-show/patients-show.component';
import { DepartmentsComponent } from '../../departments/departments.component';
import { BloodBankComponent } from '../../blood-bank/blood-bank.component';
import { CategoryComponent } from '../../category/category.component';
import { TestTypeComponent } from '../../laboratory/test-type/test-type.component';
import { MedicineHospitalComponent } from '../../medicine/medicine-hospital/medicine-hospital.component';
import { BedComponent } from '../../bed/bed/bed.component';
import { DonorComponent } from '../../donor/donor.component';
import { BedAllotmentComponent } from '../../bed/bed-allotment/bed-allotment.component';
import { CaseComponent } from '../../case/case.component';
import { LabReportPatientComponent } from '../../laboratory/lab-report-patient/lab-report-patient.component';
import { LabResultUploadComponent } from '../../laboratory/lab-result-upload/lab-result-upload.component';
import { LabReportDetailResolver } from 'src/app/_resolver/lab-report-detail.resolver';
import { PatientsLogoComponent } from '../../users/patients-logo/patients-logo.component';
import { PatientListComponent } from '../../appointments/patient-list/patient-list.component';
import { NurseListComponent } from '../../appointments/nurse-list/nurse-list.component';
import { DoctorListComponent } from '../../appointments/doctor-list/doctor-list.component';
import { AppointmentDetailsResolver } from 'src/app/_resolver/appointment-details.resolver';
import { IndividualComponent } from '../../appointments/individual/individual.component';
import { PrescriptionListComponent } from '../../drugs/prescription-list/prescription-list.component';
import { BillsComponent } from '../../transactions/bills/bills.component';
import { PrescriptionAddComponent } from '../../drugs/prescription-add/prescription-add.component';
import { PrescriptionEditComponent } from '../../drugs/prescription-edit/prescription-edit.component';
import { PrescriptionDetailResolver } from 'src/app/_resolver/prescription-detail.resolver';
import { PatientTransactionComponent } from '../../transactions/patient-transaction/patient-transaction.component';
import { TransactionListComponent } from '../../transactions/transaction-list/transaction-list.component';

const routes: Routes = [
  {
    path: '', component: MasterComponent, children: [
      { path: '', component: FeedComponent, canActivate : [AuthGuardGuard]},
      { path: 'feed', component: MasterComponent, canActivate : [AuthGuardGuard] },
      { path: 'audit', component: AuditsComponent, canActivate : [AuthGuardGuard] },
      { path: 'hospital', component: OrgListComponent, canActivate : [AuthGuardGuard] },
      { path: 'hospital/create', component: OrgCreateComponent, canActivate : [AuthGuardGuard] },
      { path: 'hospital/config/:id', component: OrgConfigComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'hospital/logo/:id', component: OrgLogoComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'hospital/edit/:id', component: OrgEditComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'cities/:id', component: CityComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'beneficiary/:id', component: BeneficiaryComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'lga/:id', component: LgaComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'lga/logo/:id/:tid', component: LgaLogoComponent, canActivate : [AuthGuardGuard], resolve: { lga: LgaEditResolver } },
      { path: 'cryptography', component: SiteCryptographyComponent, canActivate : [AuthGuardGuard] },
      { path: 'role', component: RoleComponent, canActivate : [AuthGuardGuard] },
      { path: 'department', component: DepartmentsComponent, canActivate : [AuthGuardGuard] },
      { path: 'blood-bank', component: BloodBankComponent, canActivate : [AuthGuardGuard] },
      { path: 'category', component: CategoryComponent, canActivate : [AuthGuardGuard] },
      { path: 'users', component: UserListComponent, canActivate : [AuthGuardGuard] },
      { path: 'users/add-user/:id', component: AddUserComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'users/create-agent/:id', component: AddUserComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'users/show/:id', component: EditUserComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient/show/:id', component: PatientsShowComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'admin-users/:id', component: AdminUsersComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'patients/:id', component: PatientsComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'nurses/:id', component: NursesComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'doctors/:id', component: DoctorsComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'staffs/:id', component: StaffListComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'staffs/add/:id', component: StaffAddComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'staffs/show/:id', component: StaffShowComponent, canActivate : [AuthGuardGuard], resolve: { staff: StaffDetailResolver } },
      { path: 'staffs/edit/:id', component: StaffEditComponent, canActivate : [AuthGuardGuard], resolve: { staff: StaffDetailResolver } },
      { path: 'profile/:id', component: ProfileComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver} },
      { path: 'edit-profile/:id', component: EditProfileComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver} },
      { path: 'change-avatar/:id', component: ChangeAvatarComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver} },
      { path: 'settings', component: AppSettingsComponent, canActivate : [AuthGuardGuard] },
      { path: 'invoice-settings/:id', component: InvoiceSettingsComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'test-type/:id', component: TestTypeComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'medicine/:id', component: MedicineHospitalComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'bed/:id', component: BedComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'donor/:id', component: DonorComponent, canActivate : [AuthGuardGuard], resolve: { organization: ConfigOrganizationResolver } },
      { path: 'patient/appointment/:id', component: PatientListComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient/bed-allotment/:id/:tid', component: BedAllotmentComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient-avatar/:id', component: PatientsLogoComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient/cases/:id', component: CaseComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient/lab-report/:id', component: LabReportPatientComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient/bills/:id', component: BillsComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'patient/lab-result-upload/:id/:tid', component: LabResultUploadComponent, canActivate : [AuthGuardGuard], resolve: { report: LabReportDetailResolver } },
      { path: 'nurses/appointment/:id', component: NurseListComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'doctors/appointment/:id', component: DoctorListComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'appointment/:id', component: IndividualComponent, canActivate : [AuthGuardGuard], resolve: { appointment: AppointmentDetailsResolver } },
      { path: 'prescription/:id', component: PrescriptionListComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'prescription/create/:id', component: PrescriptionAddComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'prescription/details/:id/:tid', component: PrescriptionEditComponent, canActivate : [AuthGuardGuard], resolve: { prescription: PrescriptionDetailResolver } },
      { path: 'patient/transactions/:id', component: PatientTransactionComponent, canActivate : [AuthGuardGuard], resolve: { user: UserDetailResolver } },
      { path: 'transactions', component: TransactionListComponent, canActivate : [AuthGuardGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
