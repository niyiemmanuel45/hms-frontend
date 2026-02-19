import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { TestType, TestTypeDto } from 'src/app/models/test-type';
import { AccountService } from 'src/app/services/account.service';
import { TestTypeService } from 'src/app/services/test-type.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-type',
  templateUrl: './test-type.component.html',
  styleUrls: ['./test-type.component.css']
})
export class TestTypeComponent {
  departments : TestType[] = [];
  organization : Hospital;
  userRoleStatus : string;
  code : string;
  orgId : number;
  department : TestType;
  addDto : TestTypeDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  payments: any = [];

  insertForm: FormGroup;
  testName: FormControl;
  price: FormControl;

  constructor(private deptServ : TestTypeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.code = this.organization.code;
      this.orgId = this.organization.id;
      // console.log(this.organization);
      this.GetDepartments();
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.testName = new FormControl('', [Validators.required]);
    this.price = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'testName': this.testName,
      'price': this.price
    });

    this.empDetail = this.fb.group({
      id : [''],
      testName : [''],
      price: [''],
    });
  }

  GetDepartments(){
    this.deptServ.GetAll(this.pagination)
      .subscribe((response: PaginatedResult<TestType>) => {
        this.departments = response.responseData.items as TestType[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.departments);
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
    if(!isNaN(Number(this.addDto.price))){
      var numberValue = Number(this.addDto.price);
      this.deptServ.Insert(this.addDto).subscribe(() => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.success('Lab test type added Successfully');
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
      this.toastr.error('Price must be a number');
    }
  }

  showPayItems(org: TestType){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['testName'].setValue(org.testName);
    this.empDetail.controls['price'].setValue(org.price);
  }

  UpdateDepartment(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    if(!isNaN(Number(this.addDto.price))){
      var numberValue = Number(this.addDto.price);
      this.deptServ.Update(edit.id, this.addDto).subscribe(next => {
        document.getElementById("ModalShut")?.click();
        this.toastr.success('Lab test type updated Successfully');
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
      this.toastr.error('Price must be a number');
    }    
  }

  DeleteTest(dept : TestType) : void
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
        this.deptServ.Delete(dept.id).subscribe(next => {
          this.toastr.success('Lab test type deleted Successfully');
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
