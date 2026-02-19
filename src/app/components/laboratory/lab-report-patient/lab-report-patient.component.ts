import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Case, CaseDto } from 'src/app/models/case';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { LabReport } from 'src/app/models/test-type';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CaseService } from 'src/app/services/case.service';
import Swal from 'sweetalert2';
import { LabReportDto } from '../../../models/test-type';
import { TestTypeService } from 'src/app/services/test-type.service';
import { StaffService } from 'src/app/services/staff.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-lab-report-patient',
  templateUrl: './lab-report-patient.component.html',
  styleUrls: ['./lab-report-patient.component.css']
})
export class LabReportPatientComponent {
  cases : LabReport[] = [];
  user : User = new User();
  userRoleStatus : string;
  patient : string;
  addDto : LabReportDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 3, [3, 10, 20, 30, 40]);
  details: ICurrentUser[];
  testTypes: any[];
  doctors: any[];
  urlSafe: any;
  docs: string;
  isShow: boolean = false;

  insertForm: FormGroup;
  patientId: FormControl;
  doctorId: FormControl;
  testTypeId: FormControl;
  report: FormControl;

  constructor(private testTypeServ : TestTypeService,
    private staffServ: StaffService,
    private sanitizer: DomSanitizer,
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

    this.testTypeServ.GetWithoutPage().subscribe(
      data => {
        const {items} = data.responseData;
        this.testTypes = items;
    });

    this.doctorId = new FormControl('', [Validators.required]);
    this.patientId = new FormControl('', [Validators.required]);
    this.report = new FormControl('', [Validators.required]);
    this.testTypeId = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'doctorId': this.doctorId,
      'patientId': this.patientId,
      'report': this.report,
      'testTypeId': this.testTypeId,
    });

    this.empDetail = this.fb.group({
      id : [''],
      report : [''],
      testTypeId : [''],
      patientId: [''],
      doctorId: [''],
    });

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.docs);
  }

  GetBed(id: string){
    this.testTypeServ.LabReportForPatient(id, this.pagination)
      .subscribe((response: PaginatedResult<LabReport>) => {
        this.cases = response.responseData.items as LabReport[];
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

  onPageChange(event: any, id: string){
    this.pagination.page = event;
    this.GetBed(id);
  }
  onPageSizeChange(event: any, id: string){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetBed(id);
  }

  show(org: LabReport){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['doctorId'].setValue(org.doctor.id);
    this.empDetail.controls['patientId'].setValue(org.patient.id);
    this.empDetail.controls['report'].setValue(org.report);
    this.empDetail.controls['testTypeId'].setValue(org.labTestType.id);
  }

  UpdateCase(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    this.addDto.patientId = this.patient;
    this.testTypeServ.LabReportUpdate(edit.id, this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Test updated successfully');
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
    this.testTypeServ.LabReportInsert(this.addDto).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('A new test case was added');
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

  DeleteCase(allot: LabReport) : void
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
        this.testTypeServ.LabReportDelete(allot.id).subscribe(next => {
          this.toastr.success('Test deleted Successfully');
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

  PreviewDocument(url: string){
    this.isShow = true;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
