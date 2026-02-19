import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { Prescription } from 'src/app/models/prescription';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent {
  prescriptions : Prescription[] = [];
  user : User = new User();
  userRoleStatus : string;
  patient : string;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  filters = {
    Drug: '',
    Doctor: '',
    Patient: '',
    startDate: '',
    endDate: ''
  };

  constructor(private preServ : PrescriptionService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      // console.log(this.user);
      this.patient = this.user.userId;
      this.GetPrescription(this.patient);
    });  

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  GetPrescription(id: string){
    this.preServ.PatientPrescription(id, this.pagination, this.filters)
      .subscribe((response: PaginatedResult<Prescription>) => {
        this.prescriptions = response.responseData.items as Prescription[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.prescriptions);
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
  Filter(): void {
    this.GetPrescription(this.patient);
  }

  onPageChange(event: any, id: string){
    this.pagination.page = event;
    this.GetPrescription(id);
  }
  onPageSizeChange(event: any, id: string){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetPrescription(id);
  }

  Delete(allot: Prescription) : void
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
        this.preServ.Delete(allot.id).subscribe(next => {
          this.toastr.success('Prescription deleted Successfully');
          this.GetPrescription(this.patient);
        }, error => {
          this.toastr.success(error.message);
          this.GetPrescription(this.patient);
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
