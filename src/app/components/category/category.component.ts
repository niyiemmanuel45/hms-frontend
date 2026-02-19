import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category, CategoryDto } from 'src/app/models/category';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  departments : Category[] = [];
  userRoleStatus : string;
  department : Category;
  addDto : CategoryDto;
  empDetail: FormGroup;
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  payments: any = [];

  insertForm: FormGroup;
  name: FormControl;
  description: FormControl;

  constructor(private deptServ : CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.GetDepartments();

    this.name = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'name': this.name,
      'description': this.description
    });

    this.empDetail = this.fb.group({
      id : [''],
      name : [''],
      description: [''],
    });
  }

  GetDepartments(){
    this.deptServ.GetAll(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Category>) => {
        this.departments = response.responseData.items as Category[];
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
    this.deptServ.GetAll(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Category>) => {
        this.departments = response.responseData.items as Category[];
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
    this.deptServ.Insert(this.addDto).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('Category Added Successfully');
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
  }

  showPayItems(org: Category){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['name'].setValue(org.name);
    this.empDetail.controls['description'].setValue(org.description);
  }

  UpdateDepartment(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    this.deptServ.Update(edit.id, this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Category updated Successfully');
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
  }

  DeletePayItems(dept : Category) : void
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
          this.toastr.success('Category deleted Successfully');
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
