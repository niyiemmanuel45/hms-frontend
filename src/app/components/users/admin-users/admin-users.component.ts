import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  users : User[] = [];
  userRoleStatus : string;
  details: ICurrentUser[];
  searchText: string = "";
  organization : Hospital;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];
  orgId: number;

  constructor(private userService : UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe((data : any) => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      this.GetAllAdminUsers(this.organization.id);
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  GetAllAdminUsers(id: number){
    this.userService.getAdminUsers(id, this.searchText.trim(), this.pagination)
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

  Filter(event: any, id: number): any {
    this.searchText =  event.target.value;
    this.userService.getAdminUsers(id, this.searchText.trim(), this.pagination)
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

  onPageChange(event: any, id: number){
    this.pagination.page = event;
    this.GetAllAdminUsers(id);
  }
  onPageSizeChange(event: any, id: number){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllAdminUsers(id);
  }

  deleteUser(user : User, id: number)
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
        this.userService.deleteUser(user.userId).subscribe(res => {
          // console.log(res);
          this.toastr.success("User deleted Successfully");
          this.GetAllAdminUsers(id);
        }, error => {
          console.log(error);
          this.toastr.error(error.error);
          this.GetAllAdminUsers(id);
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
