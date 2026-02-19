import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Donor, DonorDto } from 'src/app/models/donor';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { TestType, TestTypeDto } from 'src/app/models/test-type';
import { AccountService } from 'src/app/services/account.service';
import { DonorService } from 'src/app/services/donor.service';
import { TestTypeService } from 'src/app/services/test-type.service';
import Swal from 'sweetalert2';
import { BloodBankService } from '../../services/blood-bank.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent {
  donors : Donor[] = [];
  organization : Hospital;
  userRoleStatus : string;
  orgId : number;
  donor : Donor;
  addDto : DonorDto;
  empDetail: FormGroup;
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  bloodBanks: any = [];
  genders: string[] = ['Male', 'Female'];

  insertForm: FormGroup;
  name: FormControl;
  email: FormControl;
  phoneNumber: FormControl;
  sex: FormControl;
  age: FormControl;
  bloodGroupId: FormControl;

  constructor(private donorServ : DonorService,
    private bloodServ : BloodBankService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      // console.log(this.organization);
      this.GetDepartments();
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.bloodServ.GetBloodGroups().subscribe(
      data => {
        const {items} = data.responseData;
        this.bloodBanks = items;
    });

    this.name = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
    this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern("^((\\+234-?)|0)?[0-9]{10}$")]);
    this.sex = new FormControl('', [Validators.required]);
    this.age = new FormControl('', [Validators.required]);
    this.bloodGroupId = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'name': this.name,
      'email': this.email,
      'phoneNumber': this.phoneNumber,
      'bloodGroupId': this.bloodGroupId,
      'age': this.age,
      'sex': this.sex
    });

    this.empDetail = this.fb.group({
      id : [''],
      name : [''],
      email: [''],
      phoneNumber: [''],
      sex: [''],
      age: [''],
      bloodGroupId: [''],
    });
  }

  GetDepartments(){
    this.donorServ.GetAll(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Donor>) => {
        this.donors = response.responseData.items as Donor[];
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

  Filter(event: any): any {
    this.searchText =  event.target.value;
    this.donorServ.GetAll(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Donor>) => {
        this.donors = response.responseData.items as Donor[];
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
    this.GetDepartments();
  }
  onPageSizeChange(event: any){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetDepartments();
  }

  AddDepartment() {
    this.addDto = this.insertForm.value;
    if(!isNaN(Number(this.addDto.age))){
      var numberValue = Number(this.addDto.age);
      this.donorServ.Insert(this.addDto).subscribe(() => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.success('Donor added Successfully');
        this.GetDepartments();
      }, error => {
        if(error.length > 0){
          for(let err in error){
            document.getElementById("ModalClose")?.click();
            this.toastr.error(error[err]);
          }
        }else{
          document.getElementById("ModalClose")?.click();
          this.toastr.error(error);
        }
      });
    } else{
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error('Age must be a number');
    }
  }

  showPayItems(org: Donor){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['name'].setValue(org.fullname);
    this.empDetail.controls['email'].setValue(org.email);
    this.empDetail.controls['age'].setValue(org.age);
    this.empDetail.controls['bloodGroupId'].setValue(org.bloodGroup);
    this.empDetail.controls['sex'].setValue(org.sex);
    this.empDetail.controls['phoneNumber'].setValue(org.phoneNumber);
  }

  UpdateDepartment(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    if(!isNaN(Number(this.addDto.age))){
      var numberValue = Number(this.addDto.age);
      this.donorServ.Update(edit.id, this.addDto).subscribe(next => {
        document.getElementById("ModalShut")?.click();
        this.toastr.success('Donor updated Successfully');
        this.GetDepartments();
      }, error => {
        if(error.length > 0){
          for(let err in error){
            document.getElementById("ModalShut")?.click();
            this.toastr.error(error[err]);
          }
        }else{
          document.getElementById("ModalShut")?.click();
          this.toastr.error(error);
        }
      });
    } else{
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error('Age must be a number');
    }    
  }

  DeleteTest(dept : Donor) : void
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
        this.donorServ.Delete(dept.id).subscribe(next => {
          this.toastr.success('Donor deleted Successfully');
          this.GetDepartments();
        }, error => {
          this.toastr.success(error.message);
          this.GetDepartments();
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
