import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BedAllotment, BedAllotmentDto } from 'src/app/models/bed';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { PaginatedResult, Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { BedService } from 'src/app/services/bed.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bed-allotment',
  templateUrl: './bed-allotment.component.html',
  styleUrls: ['./bed-allotment.component.css']
})
export class BedAllotmentComponent {
  bedAllotments : BedAllotment[] = [];
  bedAllotment : BedAllotment;
  user : User = new User();
  userRoleStatus : string;
  tId: number;
  patient : string;
  addDto : BedAllotmentDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  beds: any = [];

  insertForm: FormGroup;
  patientId: FormControl;
  bedId: FormControl;
  allotedTime: FormControl;

  constructor(private bedServ : BedService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      // console.log(this.user);
      this.patient = this.user.userId;
      this.GetBed(this.patient);
    });
    this.route.params.subscribe(p => {
      this.tId = +p['tid'];
    });

    this.bedServ.GetAllWithoutPage().subscribe(
      data => {
        const {items} = data.responseData;
        this.beds = items;
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.bedId = new FormControl('', [Validators.required]);
    this.patientId = new FormControl('', [Validators.required]);
    this.allotedTime = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'allotedTime': this.allotedTime,
      'patientId': this.patientId,
      'bedId': this.bedId,
    });
  }

  GetBed(id: string){
    this.bedServ.PatientAllotment(id, this.pagination)
      .subscribe((response: PaginatedResult<BedAllotment>) => {
        this.bedAllotments = response.responseData.items as BedAllotment[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.bedAllotments);
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

  onPageChange(event: any, id: string){
    this.pagination.page = event;
    this.GetBed(id);
  }
  onPageSizeChange(event: any, id: string){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetBed(id);
  }

  AddBed() {
    this.addDto = this.insertForm.value;
    this.addDto.patientId = this.patient;
    this.bedServ.InsertAllotment(this.addDto).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('Bed alloted successfully');
      this.GetBed(this.patient);
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

  DischargePatient(allot: BedAllotment) : void
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, discharge patient!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.bedServ.DischargePatient(allot.id).subscribe(next => {
          this.toastr.success('Patient discharged Successfully');
          this.GetBed(this.patient);
        }, error => {
          this.toastr.success(error.message);
          this.GetBed(this.patient);
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
