import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Lga } from 'src/app/models/city';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { AddLga } from 'src/app/viewModel/add-country';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lga',
  templateUrl: './lga.component.html',
  styleUrls: ['./lga.component.css']
})
export class LgaComponent {
  organization : Hospital;
  orgId: number;
  lgas : Lga[] = [];
  userRoleStatus : string;
  details: ICurrentUser[];
  lga : Lga;
  lgaVm : AddLga;
  empDetail !: FormGroup;
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];
  cities: any = [];
  user: User;
  stateId: string;

  insertForm: FormGroup;
  name: FormControl;
  regionId: FormControl;
  cityId: FormControl;

  constructor(private countryServ : CountryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

    ngOnInit():void {
      this.details = this.acct.TokenDecodeUserDetail();
      var strArr = this.details.map(function(e){return e.toString()});
      this.userRoleStatus = strArr[4];
      this.route.data.subscribe(data => {
        this.organization = data['organization'].responseData;
        this.orgId = this.organization.id;
        // console.log(this.organization);
        this.stateId = this.organization.state.id;
        this.GetAllLGA(this.organization.state.id);
        this.countryServ.getCities(this.stateId).subscribe(
          citydata => {
            const {items} = citydata.responseData;
            this.cities = items;
        });
      });
      this.name = new FormControl('', [Validators.required]);
      this.insertForm = this.fb.group(
      {
        'name': this.name,
        'cityId': this.cityId,
        'regionId': this.regionId
      });

      this.empDetail = this.fb.group({
        id : [''],
        name : [''],
        cityId: [''],
      });
    }

    GetAllLGA(id: string){
      this.countryServ.getLgaByState(id, this.searchText.trim(), this.pagination)
        .subscribe((response: PaginatedResult<Lga>) => {
          this.lgas = response.responseData.items as Lga[];
          this.pagination.count = response.responseData.totalSize;
          this.pagination.page = response.responseData.pageNumber;
          this.pagination.pageSize = response.responseData.pageSize;
          // console.log(this.lgas);
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

    Filter(event: any, id: string): any {
      this.searchText =  event.target.value;
      this.countryServ.getLgas(id, this.searchText.trim(), this.pagination)
        .subscribe((response: PaginatedResult<Lga>) => {
          this.lgas = response.responseData.items as Lga[];
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

    onPageChange(event: any, Id: string){
      this.pagination.page = event;
      this.GetAllLGA(Id);
    }
    onPageSizeChange(event: any, Id: string){
      this.pagination.pageSize = event.target.value;
      this.pagination.page = 1;
      this.GetAllLGA(Id);
    }

    AddLGA() {
      this.lgaVm = this.insertForm.value;
      this.countryServ.saveLga(this.lgaVm).subscribe(() => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.success('LGA Added Successfully');
        this.GetAllLGA(this.stateId);
      }, error => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.error(error.error.message);
      });
    }

    showLGA(lga: Lga){
      this.empDetail.controls['id'].setValue(lga.id);
      this.empDetail.controls['name'].setValue(lga.name);
      this.empDetail.controls['cityId'].setValue(lga.cityId);
    }

    updateLGA(){
      let edit = this.empDetail.value;
      this.lgaVm = edit;
      this.countryServ.updateLga(edit.id, this.lgaVm).subscribe(next => {
        document.getElementById("ModalShut")?.click();
        this.toastr.success('LGA updated Successfully');
        this.GetAllLGA(this.stateId);
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

    deleteLGA(lga : Lga) : void
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
          this.countryServ.deleteLga(lga.id).subscribe(next => {
            this.toastr.success('LGA deleted Successfully');
            this.GetAllLGA(this.stateId);
          }, error => {
            this.toastr.success(error.message);
            this.GetAllLGA(this.stateId);
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
