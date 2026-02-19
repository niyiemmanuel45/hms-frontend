import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appointment, AppointmentDto, AppointmentStatusDto } from 'src/app/models/appointment';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { StaffService } from 'src/app/services/staff.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nurse-list',
  templateUrl: './nurse-list.component.html',
  styleUrls: ['./nurse-list.component.css']
})
export class NurseListComponent {
  cases : Appointment[] = [];
  case : Appointment;
  userId : string;
  user : User = new User();
  userRoleStatus : string;
  addDto : AppointmentDto;
  empDetail: FormGroup;
  conFim: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 6, [6, 10, 20, 30, 40]);
  details: ICurrentUser[];
  doctors: any[];
  patients: any[];

  filters = {
    Status: '',
    Doctor: '',
    CardNumber: '',
    startDate: '',
    endDate: ''
  };

  insertForm: FormGroup;
  patientId: FormControl;
  remark: FormControl;
  doctorId: FormControl;
  date: FormControl;

  constructor(private caseServ : AppointmentService,
    private staffServ: StaffService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.userId = this.user.userId;
      // console.log(this.user);
      this.GetBed();

      this.staffServ.DoctorsWithoutPage(this.user.hospital?.id!).subscribe(
        data => {
          const {items} = data.responseData;
          this.doctors = items;
      });

      this.userService.AllPatients(this.user.hospital?.id!).subscribe(
        data => {
          const {items} = data.responseData;
          this.patients = items;
      });
    });  

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.doctorId = new FormControl('', [Validators.required]);
    this.patientId = new FormControl('', [Validators.required]);
    this.date = new FormControl('', [Validators.required]);
    this.remark = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'remark': this.remark,
      'patientId': this.patientId,
      'doctorId': this.doctorId,
      'date': this.date,
    });

    this.empDetail = this.fb.group({
      id : [''],
      remark : [''],
      doctorId : [''],
      patientId: [''],
      date: [''],
    });
  }

  GetBed(){
    this.caseServ.GetAll(this.pagination, this.filters)
      .subscribe((response: PaginatedResult<Appointment>) => {
        this.cases = response.responseData.items as Appointment[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.cases);
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
    this.GetBed();
  }

  onPageChange(event: any){
    this.pagination.page = event;
    this.GetBed();
  }
  onPageSizeChange(event: any){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetBed();
  }

  show(org: Appointment){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['doctorId'].setValue(org.doctor.id);
    this.empDetail.controls['patientId'].setValue(org.patient.id);
    this.empDetail.controls['remark'].setValue(org.remark);
    this.empDetail.controls['date'].setValue(org.date);
  }

  UpdateCase(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    this.caseServ.Update(edit.id, this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Appointment updated successfully');
      this.GetBed();
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

  AddBed() {
    this.addDto = this.insertForm.value;
    this.caseServ.Insert(this.addDto).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('A new appointment was added');
      this.GetBed();
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

  Approve(id: number) : void
  {
    let update = new AppointmentStatusDto();
    update.id = id;
    update.status = 2;
    Swal.fire({
      title: 'Do you want to confirm appointment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.caseServ.ConfirmAppointment(update).subscribe(next => {
          this.toastr.success('Appointment confirmed successfully');
          this.GetBed();
        }, error => {
          this.toastr.success(error.message);
          this.GetBed();
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

  Reject(id: number) : void
  {
    let update = new AppointmentStatusDto();
    update.id = id;
    update.status = 3;
    Swal.fire({
      title: 'Do you want to reject appointment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.caseServ.ConfirmAppointment(update).subscribe(next => {
          this.toastr.success('Appointment rejected successfully');
          this.GetBed();
        }, error => {
          this.toastr.success(error.message);
          this.GetBed();
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

  DeleteCase(allot: Appointment) : void
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
        this.caseServ.Delete(allot.id).subscribe(next => {
          this.toastr.success('Appointment deleted Successfully');
          this.GetBed();
        }, error => {
          this.toastr.success(error.message);
          this.GetBed();
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
