import { Component, ViewChild } from '@angular/core';
import { FormArray, FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Setting } from 'src/app/models/organization-setting';
import { AccountService } from 'src/app/services/account.service';
import { SettingService } from 'src/app/services/setting.service';
import { SettingVM, InvoiceChargesVM } from 'src/app/viewModel/organizationVM';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-org-config',
  templateUrl: './org-config.component.html',
  styleUrls: ['./org-config.component.css']
})
export class OrgConfigComponent {
  organization : Hospital;
  searchText: string;
  settingsForm: FormArray = this.fb.array([]);
  setting = new SettingVM();
  dataarray: any[] = [];
  configurations: Setting[];
  details: ICurrentUser[];
  currentUserId: string;
  userRoleStatus : string;
  orgId : number;
  chargesDto : InvoiceChargesVM;
  formProduct: FormGroup;
  hasTenantSubscribed: boolean;
  selectAll: boolean = false;

  @ViewChild('editForm') editForm: NgForm | undefined;
  @ViewChild('setAmtForm') setAmtForm: NgForm | undefined;
  @ViewChild('useFeeForm') useFeeForm: NgForm | undefined;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private organSettings : SettingService,
    private toastr: ToastrService,
    private acct: AccountService){
      this.formProduct = this.fb.group({
        productsubcribe: this.fb.array([], [Validators.required])
      })
    }

  ngOnInit() {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});

    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      this.GetAllSettings(this.organization.id);
    });
    this.dataarray.push(this.setting);
    this.userRoleStatus = strArr[4];
    this.currentUserId = strArr[0];
    // console.log(this.currentUserId);
  }

  GetAllSettings(id: number){
    this.organSettings.GetSettings(id)
      .subscribe((response : any) => {
        this.configurations = response.responseData;
        // console.log(this.configurations);
      },
      (error) => {
        return of(null);
      }
    );
  }

  AddSettings(){
    const processedData = {
      ...this.dataarray
    };
    let sortCode = this.editForm?.value.orgCode;
    let id = this.editForm?.value.id;
    var obj = Object.assign([], processedData)
    const payload = obj;
    // console.log({"settings": payload});
    this.organSettings.AddSettings(sortCode, {"settings": payload}).subscribe(() => {
      this.toastr.success('Hospital configuration settings added successfully');
      this.dataarray.splice(1);
      this.GetAllSettings(id);
      this.editForm?.reset();
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

  addForm() {
    this.setting = new SettingVM();
    this.dataarray.push(this.setting);
  }

  removeForm(index: number){
    this.dataarray.splice(index);
  }

  deleteConfig(config: Setting, id: number) : void
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
        this.organSettings.DeleteSettings(config.id).subscribe(next => {
          this.toastr.success('Hospital configuration settings deleted Successfully');
          this.GetAllSettings(id);
          setTimeout(function(){
            window.location.reload();
        }, 1000);
        }, error => {
          this.toastr.error(error.message);
          this.GetAllSettings(id);
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
