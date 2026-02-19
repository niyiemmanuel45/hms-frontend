import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Bed, BedDto } from 'src/app/models/bed';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { BedService } from 'src/app/services/bed.service';
import { DepartmentService } from 'src/app/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bed',
  templateUrl: './bed.component.html',
  styleUrls: ['./bed.component.css']
})
export class BedComponent {
  beds : Bed[] = [];
  bed : Bed;
  organization : Hospital;
  userRoleStatus : string;
  code : string;
  orgId : number;
  addDto : BedDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  departments: any = [];

  insertForm: FormGroup;
  quantity: FormControl;
  departmentId: FormControl;

  constructor(private bedServ : BedService,
    private deptServ : DepartmentService,
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

    this.deptServ.GetAllWithoutPage().subscribe(
      data => {
        const {items} = data.responseData;
        this.departments = items;
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.quantity = new FormControl('', [Validators.required]);
    this.departmentId = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'quantity': this.quantity,
      'departmentId': this.departmentId
    });

    this.empDetail = this.fb.group({
      id : [''],
      quantity : [''],
      departmentId: [''],
    });
  }

  GetDepartments(){
    this.bedServ.GetAll(this.pagination)
      .subscribe((response: PaginatedResult<Bed>) => {
        this.beds = response.responseData.items as Bed[];
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
    if(!isNaN(Number(this.addDto.quantity))){
      this.bedServ.Insert(this.addDto).subscribe(() => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.success('Bed added Successfully');
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
      this.toastr.error('Quantity must be a number');
    }
  }

  showPayItems(org: Bed){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['departmentId'].setValue(org.department.id);
    this.empDetail.controls['quantity'].setValue(org.quantity);
  }

  UpdateDepartment(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    if(!isNaN(Number(this.addDto.quantity))){
      this.bedServ.Update(edit.id, this.addDto).subscribe(next => {
        document.getElementById("ModalShut")?.click();
        this.toastr.success('Bed updated Successfully');
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
      this.toastr.error('Quantity must be a number');
    }    
  }

  DeleteTest(dept : Bed) : void
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
        this.bedServ.Delete(dept.id).subscribe(next => {
          this.toastr.success('Bed deleted Successfully');
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
