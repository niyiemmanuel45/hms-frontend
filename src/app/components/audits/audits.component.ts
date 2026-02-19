import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Audit } from 'src/app/models/audit';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.css']
})
export class AuditsComponent {
  audits : Audit[] = [];
  details: ICurrentUser[];
  userRoleStatus : string;
  appid: string;
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  empDetail: FormGroup;
  
  constructor(
    private auditService: AuditService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private acct: AccountService) { }

  ngOnInit() {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
    this.appid = strArr[5];
    this.GetAllAudit();

    this.empDetail = this.fb.group({
      id : [''],
      createdBy : [''],
      action: [''],
      createdDate: [''],
      module: [''],
      ipAddress: [''],
      customDatas: [''],
      operationPerformed: [''],
      tenantId: [''],
    });
  }

  GetAllAudit(){
    this.auditService.getAudits(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Audit>) => {
        this.audits = response.responseData.items as Audit[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.audits);
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
    this.auditService.getAudits(this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<Audit>) => {
        this.audits = response.responseData.items as Audit[];
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
    this.GetAllAudit();
  }
  onPageSizeChange(event: any){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllAudit();
  }

  show(org: Audit){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['createdBy'].setValue(org.createdBy);
    this.empDetail.controls['action'].setValue(org.action);
    this.empDetail.controls['ipAddress'].setValue(org.ipAddress);
    this.empDetail.controls['operationPerformed'].setValue(org.operationPerformed);
    this.empDetail.controls['tenantId'].setValue(org.tenantId);
    this.empDetail.controls['customDatas'].setValue(org.customDatas == "N/A" ? org.customDatas : JSON.stringify(JSON.parse(org.customDatas), null, 4));
    const formattedDate = this.datePipe.transform(org.createdDate, 'dd MMM yyyy');
    this.empDetail.controls['createdDate'].setValue(formattedDate);
  }
}
