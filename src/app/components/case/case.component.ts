import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Case, CaseDto } from 'src/app/models/case';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CaseService } from 'src/app/services/case.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent {
  cases : Case[] = [];
  case : Case;
  user : User = new User();
  userRoleStatus : string;
  patient : string;
  addDto : CaseDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 3, [3, 10, 20, 30, 40]);
  details: ICurrentUser[];

  insertForm: FormGroup;
  patientId: FormControl;
  title: FormControl;
  statement: FormControl;

  constructor(private caseServ : CaseService,
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

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.title = new FormControl('', [Validators.required]);
    this.patientId = new FormControl('', [Validators.required]);
    this.statement = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'title': this.title,
      'patientId': this.patientId,
      'statement': this.statement,
    });

    this.empDetail = this.fb.group({
      id : [''],
      title : [''],
      statement : [''],
      patientId: [''],
      cardNumber: [''],
      patientName: [''],
    });
  }

  GetBed(id: string){
    this.caseServ.GetAll(id, this.pagination)
      .subscribe((response: PaginatedResult<Case>) => {
        this.cases = response.responseData.items as Case[];
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

  show(org: Case){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['cardNumber'].setValue(org.cardNumber);
    this.empDetail.controls['patientName'].setValue(org.patient);
    this.empDetail.controls['title'].setValue(org.title);
    this.empDetail.controls['statement'].setValue(org.statement);
  }

  UpdateCase(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    this.addDto.patientId = this.patient;
    this.caseServ.Update(edit.id, this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Case updated successfully');
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
      this.toastr.success('A new case was added');
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

  DeleteCase(allot: Case) : void
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
          this.toastr.success('Case deleted Successfully');
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
