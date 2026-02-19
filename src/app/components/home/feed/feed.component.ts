import { Component } from '@angular/core';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult, DashBoardResult } from 'src/app/models/pagination';
import { DashboardDto, Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { RemitaService } from 'src/app/services/remita.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  transactions : Transaction[] = [];
  data : DashboardDto | undefined;
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
    private acct: AccountService) { }

  ngOnInit():void {
    this.GetTransactions();
    this.Dashboard();

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];
  }

  GetTransactions(){
    this.remitaService.DashboardTrazact(this.pagination, this.filters)
      .subscribe((response: PaginatedResult<Transaction>) => {
        this.transactions = response.responseData.items as Transaction[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.transactions);
    },error => {
      console.log(error);
    });
  }

  Filter(): void {
    this.GetTransactions();
  }

  Dashboard(){
    this.remitaService.Dashboard()
      .subscribe((response: DashBoardResult<DashboardDto>) => {
        this.data = response.payload
        // console.log(this.data);
    },error => {
      console.log(error);
    });
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
}
