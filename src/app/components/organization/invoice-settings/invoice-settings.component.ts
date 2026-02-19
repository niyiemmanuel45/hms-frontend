import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { AccountService } from 'src/app/services/account.service';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.css']
})
export class InvoiceSettingsComponent {
  organization : Hospital;
  orgId : number;
  details: ICurrentUser[];
  userRoleStatus : string;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;

  insertForm: FormGroup;
  key: FormControl;
  pictureURL: FormControl;

  @ViewChild('useTreasurerForm') useTreasurerForm: NgForm | undefined;
  @ViewChild('useInvoiceForm') useInvoiceForm: NgForm | undefined;
  @ViewChild('useReceiptForm') useReceiptForm: NgForm | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private orgService : HospitalService,
    private acct: AccountService){ }

  ngOnInit() {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});

    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      // console.log(this.organization);
    });
    this.userRoleStatus = strArr[4];


    this.key = new FormControl('', [Validators.required]);
    this.pictureURL = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'key': this.key,
      'pictureURL': this.pictureURL,
    });
  }
  onFileChange(event: any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFiles = event.target.files;

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.insertForm.patchValue({
          fileSource: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  submit(){
    const payload = this.insertForm.value;
    // console.log(payload.key);
    const file: File | null = this.selectedFiles?.item(0)!;
    if(file === undefined){
      this.toastr.error('A file is required!');
      this.router.navigate(['/feed/invoice-settings', this.orgId]);
    }else{
      this.currentFile = file;
      this.orgService.UploadSignature(this.organization.id, this.currentFile, payload.key)
        .subscribe((response: any) => {
          if(response.status == 200){
            this.toastr.success('Signature uploaded successfully');
            setTimeout(() => {
                document.location.reload();
              }, 1000);
            this.router.navigate(['/feed/invoice-settings', this.orgId]);
          }
      }, error => {
        if(error.length > 0){
          for(let err in error){
            this.toastr.error(error[err]);
          }
        }else{
          this.toastr.error(error);
        }
      });
    }
  }

  UseTreasurer()
  {
    let fee = this.useTreasurerForm?.value;
    // console.log(fee);
    this.orgService.SetSignature(this.orgId).subscribe(next => {
      this.toastr.success('Signature updated Successfully');
      this.router.navigate(['/feed/invoice-settings', this.orgId]);
    }, error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error);
      }
    });
  }

  UseInvoice()
  {
    let invoice = this.useInvoiceForm?.value;
    this.orgService.SetInvoice(this.orgId).subscribe(next => {
      this.toastr.success('Signature updated Successfully');
      this.router.navigate(['/feed/invoice-settings', this.orgId]);
    }, error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error);
      }
    });
  }

  UseReceipt()
  {
    let receipt = this.useReceiptForm?.value;
    this.orgService.SetReceipt(this.orgId).subscribe(next => {
      this.toastr.success('Receipt updated Successfully');
      this.router.navigate(['/feed/invoice-settings', this.orgId]);
    }, error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error);
      }
    });
  }
}
