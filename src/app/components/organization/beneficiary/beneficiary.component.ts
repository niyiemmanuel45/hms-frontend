import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Beneficiary, AddBeneficiary } from 'src/app/models/beneficiary';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css']
})
export class BeneficiaryComponent {
  organization : Hospital;
  orgId : number;
  details: ICurrentUser[];
  userRoleStatus : string;
  beneficiaries : Beneficiary[] = [];
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];
  beneficiaryDetail !: FormGroup;
  beneficiaryVm : AddBeneficiary;

  insertForm: FormGroup;
  name: FormControl;
  lineItemsId: FormControl;
  accountNumber: FormControl;
  bankCode: FormControl;
  amount: FormControl;
  deductFeeFrom: FormControl;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private beneficiaryService : BeneficiaryService,
    private acct: AccountService){ }

  ngOnInit() {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});

    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      // console.log(this.organization);
      this.GetAllBeneficiaries(this.orgId);
    });
    this.userRoleStatus = strArr[4];

    this.name = new FormControl('', [Validators.required]);
    this.lineItemsId = new FormControl('', [Validators.required]);
    this.accountNumber = new FormControl('', [Validators.required]);
    this.bankCode = new FormControl('', [Validators.required]);
    this.amount = new FormControl('', [Validators.required]);
    this.deductFeeFrom = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'name': this.name,
      'lineItemsId': this.lineItemsId,
      'accountNumber': this.accountNumber,
      'bankCode': this.bankCode,
      'amount': this.amount,
      'deductFeeFrom': this.deductFeeFrom,
    });

    this.beneficiaryDetail = this.fb.group({
      id : [''],
      beneficiaryName : [''],
      lineItemsId: [''],
      beneficiaryAccount: [''],
      bankCode: [''],
      beneficiaryAmount: [''],
      deductFeeFrom: [''],
    });
  }

  GetAllBeneficiaries(id: number)
  {
    this.beneficiaryService.getByHospitalId(id, this.pagination)
      .subscribe((response: PaginatedResult<Beneficiary>) => {
        this.beneficiaries = response.responseData.items as Beneficiary[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.beneficiaries);
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
    this.GetAllBeneficiaries(id);
  }
  onPageSizeChange(event: any, id: number){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllBeneficiaries(id);
  }

  AddGetAllBeneficiary() {
    this.beneficiaryVm = this.insertForm.value;
    this.beneficiaryVm.tenantId = this.organization.id;
    this.beneficiaryVm.amount = Number(this.insertForm.value.amount);
    this.beneficiaryService.Insert(this.beneficiaryVm).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('Beneficiary Added Successfully');
      this.GetAllBeneficiaries(this.orgId);
    }, error => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error(error.error.message);
    });
  }

  showBeneficiary(ben: Beneficiary){
    this.beneficiaryDetail.controls['id'].setValue(ben.id);
    this.beneficiaryDetail.controls['bankCode'].setValue(ben.bankCode);
    this.beneficiaryDetail.controls['beneficiaryAccount'].setValue(ben.beneficiaryAccount);
    this.beneficiaryDetail.controls['beneficiaryName'].setValue(ben.beneficiaryName);
    this.beneficiaryDetail.controls['lineItemsId'].setValue(ben.lineItemsId);
    this.beneficiaryDetail.controls['deductFeeFrom'].setValue(ben.deductFeeFrom);
    this.beneficiaryDetail.controls['beneficiaryAmount'].setValue(ben.beneficiaryAmount);
  }

  updateBeneficiary(){
    let edit = this.beneficiaryDetail.value;
    this.beneficiaryVm = edit;
    this.beneficiaryVm.tenantId = this.orgId;
    this.beneficiaryVm.name = this.beneficiaryDetail.value.beneficiaryName;
    this.beneficiaryVm.accountNumber = this.beneficiaryDetail.value.beneficiaryAccount;
    this.beneficiaryVm.amount = Number(this.beneficiaryDetail.value.beneficiaryAmount);
    // console.log(this.beneficiaryVm);
    this.beneficiaryService.Update(edit.id, this.beneficiaryVm).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Beneficiary updated Successfully');
      this.GetAllBeneficiaries(this.orgId);
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

  deleteBeneficiary(city : Beneficiary) : void
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
        this.beneficiaryService.Delete(city.id).subscribe(next => {
          this.toastr.success("Beneficiary deleted Successfully");
          this.GetAllBeneficiaries(this.orgId);
        }, error => {
          this.toastr.error(error.error.message);
          this.GetAllBeneficiaries(this.orgId);
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
