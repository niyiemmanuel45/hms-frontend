import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Bills, BillsDto } from 'src/app/models/bills';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { BillsService } from 'src/app/services/bills.service';
import { RemitaService } from 'src/app/services/remita.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent {
  bills : Bills[] = [];
  user : User = new User();
  userRoleStatus : string;
  bill : Bills;
  patient : string;
  addDto : BillsDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 3, [3, 10, 20, 30, 40]);
  details: ICurrentUser[];


  insertForm: FormGroup;
  patientId: FormControl;
  description: FormControl;
  amount: FormControl;

  constructor(private billServ : BillsService,
    private remitaService: RemitaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      // console.log(this.user);
      this.patient = this.user.userId;
      this.GetBills(this.patient);
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.amount = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'amount': this.amount,
      'patientId': this.patientId,
      'description': this.description,
    });

    this.empDetail = this.fb.group({
      id : [''],
      description : [''],
      amount : [''],
      status : [''],
      patientId: [''],
    });
  }

  GetBills(id: string){
    this.billServ.GetAll(id, this.pagination)
      .subscribe((response: PaginatedResult<Bills>) => {
        this.bills = response.responseData.items as Bills[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.bills);
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
    this.GetBills(id);
  }
  onPageSizeChange(event: any, id: string){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetBills(id);
  }

  show(org: Bills){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['description'].setValue(org.description);
    this.empDetail.controls['patientId'].setValue(org.patient.id);
    this.empDetail.controls['amount'].setValue(org.amount);
    this.empDetail.controls['status'].setValue(org.status);
  }

  UpdateBills(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    this.addDto.patientId = this.patient;
    this.billServ.Update(edit.id, this.addDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Bills updated successfully');
      this.GetBills(this.patient);
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

  AddBills() {
    this.addDto = this.insertForm.value;
    this.addDto.patientId = this.patient;
    this.billServ.Insert(this.addDto).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('A new bill was added');
      this.GetBills(this.patient);
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

  DeleteBill(allot: Bills) : void
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
        this.billServ.Delete(allot.id).subscribe(next => {
          this.toastr.success('Bills deleted Successfully');
          this.GetBills(this.patient);
        }, error => {
          this.toastr.success(error.message);
          this.GetBills(this.patient);
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

  initiatePayment(id: number)
  {
    Swal.fire({
      title: 'Are you sure you want to make payment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, make payment!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.remitaService.MakePayment(id).subscribe(response => {
          let res = response.responseData;
          this.toastr.success('Payment was successful');
          this.router.navigate(['/feed/patient/transactions', this.patient]);
        }, error => {
          this.toastr.success(error.message);
          this.GetBills(this.patient);
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

  PrintReceipt(id: number)
  {
    this.remitaService.PrintReceipt(id).subscribe(response => {
      // console.log(response.responseData);
      this.downloadFile(response.responseData);
    }, error => {
      console.log('Error downloading PDF:', error);
    });
  }

  downloadFile(pdfUrl: string) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = pdfUrl.split('/').pop() || 'download_bills.pdf'; // Extract the filename or set a default
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
