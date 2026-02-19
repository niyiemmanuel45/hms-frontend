import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { Staff } from 'src/app/models/staff';
import { AccountService } from 'src/app/services/account.service';
import { StaffService } from 'src/app/services/staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent {
  organization : Hospital;
  orgId : number;
  staffs : Staff[] = [];
  userRoleStatus : string;
  details: ICurrentUser[];
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 6, [10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];

  constructor(private staffService : StaffService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe((data : any) => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      this.GetAllStaffs(this.organization.id);
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  GetAllStaffs(id: number){
    this.staffService.getDoctors(id, this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Staff>) => {
        this.staffs = response.responseData.items as Staff[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.staffs);
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
    this.staffService.getDoctors(id, this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Staff>) => {
        this.staffs = response.responseData.items as Staff[];
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
    this.GetAllStaffs(id);
  }
  onPageSizeChange(event: any, id: number){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllStaffs(id);
  }


  deleteUser(user : Staff, id: number) : void
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
        this.staffService.deleteStaff(user.id).subscribe(next => {
          this.toastr.success("Staff deleted Successfully");
          this.GetAllStaffs(id);
        }, error => {
          this.toastr.error(error.error.message);
          this.GetAllStaffs(id);
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
