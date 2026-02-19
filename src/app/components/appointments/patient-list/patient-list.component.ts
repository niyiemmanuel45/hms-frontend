import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appointment, AppointmentDto } from 'src/app/models/appointment';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { StaffService } from 'src/app/services/staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {
  cases : Appointment[] = [];
  case : Appointment;
  user : User = new User();
  userRoleStatus : string;
  patient : string;
  addDto : AppointmentDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 6, [6, 10, 20, 30, 40]);
  details: ICurrentUser[];
  doctors: any[];

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

      this.staffServ.DoctorsWithoutPage(this.user.hospital?.id!).subscribe(
        data => {
          const {items} = data.responseData;
          this.doctors = items;
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

  GetBed(id: string){
    this.caseServ.PatientAppointment(id, this.pagination, this.filters)
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
    this.GetBed(this.patient);
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
    this.addDto.patientId = this.patient;
    this.caseServ.Update(edit.id, this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Appointment updated successfully');
      this.GetBed(this.patient);
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
    this.addDto.patientId = this.patient;
    this.caseServ.Insert(this.addDto).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('A new appointment was added');
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
