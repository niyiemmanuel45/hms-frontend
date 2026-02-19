import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { UserService } from 'src/app/services/user.service';
import { OrganizationVM } from 'src/app/viewModel/organizationVM';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.css']
})
export class OrgListComponent {
  organizations : Hospital[] = [];
  userRoleStatus : string;
  organization : Hospital;
  orgVm : OrganizationVM;
  empDetail: FormGroup;
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];

  constructor(private organServ : HospitalService,
    private fb: FormBuilder,
    private countryServ: CountryService,
    private toastr: ToastrService,
    private userService: UserService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.GetAllOrganizations();

    this.empDetail = this.fb.group({
      id : [''],
      name : [''],
      code: [''],
      slogan: [''],
      licenseNumber: [''],
      redirectUrl: [''],
      websiteURL: [''],
      contactName: [''],
      emailAddress: [''],
      phoneNumber: [''],
      cityId: [''],
      address: [''],
      stateId: [''],
      countryId: [''],
    });
  }

  GetAllOrganizations(){
    this.organServ.GetAll(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Hospital>) => {
        this.organizations = response.responseData.items as Hospital[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.organizations);
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

  Filter(event: any): any {
    this.searchText =  event.target.value;
    this.organServ.GetAll(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Hospital>) => {
        this.organizations = response.responseData.items as Hospital[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
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

  onPageChange(event: any){
    this.pagination.page = event;
    this.GetAllOrganizations();
  }
  onPageSizeChange(event: any){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllOrganizations();
  }

  showOrg(org: Hospital){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['name'].setValue(org.name);
    this.empDetail.controls['code'].setValue(org.code);
    this.empDetail.controls['slogan'].setValue(org.slogan);
    this.empDetail.controls['redirectUrl'].setValue(org.redirectUrl);
    this.empDetail.controls['websiteURL'].setValue(org.websiteURL);
    this.empDetail.controls['licenseNumber'].setValue(org.licenseNumber);
    this.empDetail.controls['contactName'].setValue(org.contactName);
    this.empDetail.controls['emailAddress'].setValue(org.emailAddress);
    this.empDetail.controls['phoneNumber'].setValue(org.phoneNumber);
    this.empDetail.controls['address'].setValue(org.address);
    this.empDetail.controls['countryId'].setValue(org.country.name);
    this.empDetail.controls['stateId'].setValue(org.state.name);
    this.empDetail.controls['cityId'].setValue(org.city.name);
  }

  deleteOrganization(org : Hospital) : void
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.organServ.Delete(org.id).subscribe(next => {
          this.userService.deleteMultipleUsers(org.id).subscribe(next => {
            this.toastr.success('Hospital deleted Successfully');
            this.GetAllOrganizations();
          }, error => {
            this.toastr.success(error.message);
            this.GetAllOrganizations();
          });
        }, error => {
          this.toastr.success(error.message);
          this.GetAllOrganizations();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          '',
          'error'
        )
      }
    });
  }
}
