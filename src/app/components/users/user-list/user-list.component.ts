import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AddRemoveModel } from 'src/app/models/role';
import { User, Roles } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users : User[] = [];
  userRoleStatus : string;
  details: ICurrentUser[];
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 6, [6, 10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];
  userDetail !: FormGroup;
  roles: any = [];
  addDto: AddRemoveModel;

  constructor(private userService : UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private acct: AccountService) { }

  ngOnInit():void {

    this.GetAllUsers();

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.userService.GetRoles().subscribe(
      (data: Roles) => {
        this.roles = data;
    });

    this.userDetail = this.formBuilder.group({
      userId : [''],
      firstName : [''],
      lastName: [''],
      email: [''],
      roleId: [''],
      roleName: [''],
      oldRoleId: [''],
    });
  }

  GetAllUsers(){
    this.userService.getUsers(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<User>) => {
        this.users = response.responseData.items as User[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.users);
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
    this.userService.getUsers(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<User>) => {
        this.users = response.responseData.items as User[];
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
    this.GetAllUsers();
  }

  onPageSizeChange(event: any){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllUsers();
  }

  showUser(user : User)
  {
    this.userDetail.controls['userId'].setValue(user.userId);
    this.userDetail.controls['firstName'].setValue(user.firstName);
    this.userDetail.controls['lastName'].setValue(user.lastName + " "+ user.firstName);
    this.userDetail.controls['email'].setValue(user.email);
    this.userDetail.controls['roleName'].setValue(user.role);
    this.userDetail.controls['oldRoleId'].setValue(user.roleId);
  }

  SwapRole(){
    let edit = this.userDetail.value;
    this.addDto = edit;
    // console.log(this.addDto);
    this.userService.SwapUserRole(this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Role swapped Successfully');
      this.GetAllUsers();
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

  deleteUser(user : User) : void
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
        this.userService.deleteUser(user.userId).subscribe(next => {
          this.toastr.success("User deleted Successfully");
          this.GetAllUsers();
        }, error => {
          this.toastr.error(error.error.message);
          this.GetAllUsers();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          '',
          'error'
        )
      }
    })
  }
}
