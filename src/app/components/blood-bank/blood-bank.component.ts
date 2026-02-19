import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BloodGroupDto, BloodGroups } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { BloodBankService } from 'src/app/services/blood-bank.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blood-bank',
  templateUrl: './blood-bank.component.html',
  styleUrls: ['./blood-bank.component.css']
})
export class BloodBankComponent {
  departments : BloodGroups[] = [];
  userRoleStatus : string;
  department : BloodGroups;
  addDto : BloodGroupDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  payments: any = [];

  insertForm: FormGroup;
  bloodGroup: FormControl;
  quantity: FormControl;

  constructor(private deptServ : BloodBankService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.GetDepartments();

    this.bloodGroup = new FormControl('', [Validators.required]);
    this.quantity = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'bloodGroup': this.bloodGroup,
      'quantity': this.quantity
    });

    this.empDetail = this.fb.group({
      id : [''],
      bloodGroup : [''],
      quantity: [''],
    });
  }

  GetDepartments(){
    this.deptServ.GetAll(this.pagination)
      .subscribe((response: PaginatedResult<BloodGroups>) => {
        this.departments = response.responseData.items as BloodGroups[];
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
      var numberValue = Number(this.addDto.quantity);
      this.deptServ.Insert(this.addDto).subscribe(() => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.success('Blood group added successfully');
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

  showPayItems(org: BloodGroups){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['bloodGroup'].setValue(org.bloodGroup);
    this.empDetail.controls['quantity'].setValue(org.quantity);
  }

  UpdateDepartment(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    if(!isNaN(Number(this.addDto.quantity))){
      var numberValue = Number(this.addDto.quantity);
      this.deptServ.Update(edit.id, this.addDto).subscribe(next => {
        document.getElementById("ModalShut")?.click();
        this.toastr.success('Blood group updated Successfully');
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

  DeletePayItems(dept : BloodGroups) : void
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
          this.toastr.success('Blood group deleted successfully');
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
