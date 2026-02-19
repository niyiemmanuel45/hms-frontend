import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { RemitaService } from 'src/app/services/remita.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  transactions : Transaction[] = [];
  userRoleStatus : string;
  pagination: Pagination = new Pagination(1, 0, 3, [3, 10, 20, 30, 40]);
  details: ICurrentUser[];

  filters = {
    status: '',
    reference: '',
    patientName: '',
    startDate: '',
    endDate: ''
  };

  constructor(private remitaService: RemitaService,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.GetTransactions();

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  GetTransactions(){
    this.remitaService.GetAll(this.pagination, this.filters)
      .subscribe((response: PaginatedResult<Transaction>) => {
        this.transactions = response.responseData.items as Transaction[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.transactions);
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
    this.GetTransactions();
  }

  onPageChange(event: any){
    this.pagination.page = event;
    this.GetTransactions();
  }
  onPageSizeChange(event: any){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetTransactions();
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
    link.download = pdfUrl.split('/').pop() || 'download_receipt.pdf'; // Extract the filename or set a default
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  Terminate(id: string) : void
  {
    Swal.fire({
      title: 'Are you sure you want to terminate payment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, terminate payment!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.remitaService.TerminateTransaction(id).subscribe(response => {
          this.toastr.success('Payment terminated successfully');
          this.GetTransactions();
        }, error => {
          this.toastr.success(error.message);
          this.GetTransactions();
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

  confirmPayment(id: string)
  {
    Swal.fire({
      title: 'Are you sure you want to confirm payment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm payment!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.remitaService.ConfirmPayment(id).subscribe(response => {
          this.toastr.success('Payment confirmed successfully');
          this.GetTransactions();
        }, error => {
          this.toastr.success(error.message);
          this.GetTransactions();
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
