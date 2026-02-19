import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/models/city';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { AddCity } from 'src/app/viewModel/add-country';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent {
  organization : Hospital;
  searchText: string = "";
  details: ICurrentUser[];
  userRoleStatus : string;
  orgId : number;
  cities : City[] = [];
  stateId: string;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];
  cityDetail !: FormGroup;
  cityVm : AddCity;

  insertForm: FormGroup;
  name: FormControl;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private countryService : CountryService,
    private acct: AccountService){ }

  ngOnInit() {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});

    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      // console.log(this.organization);
      this.stateId = this.organization.state.id;
      this.GetAllCities(this.stateId);
    });
    this.userRoleStatus = strArr[4];

    this.name = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'name': this.name,
      'latitude': 120,
      'longitude': 130,
    });

    this.cityDetail = this.fb.group({
      id : [''],
      name : [''],
      regionId: [''],
      regionName: [''],
    });
  }

  GetAllCities(id: string){
    this.countryService.CitiesByState(id, this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<City>) => {
        this.cities = response.responseData.items as City[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.cities);
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
    this.countryService.CitiesByState(id, this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<City>) => {
        this.cities = response.responseData.items as City[];
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

  onPageChange(event: any, id: string){
    this.pagination.page = event;
    this.GetAllCities(id);
  }
  onPageSizeChange(event: any, id: string){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllCities(id);
  }

  AddCity() {
    this.cityVm = this.insertForm.value;
    this.cityVm.regionId = this.organization.state.id;
    this.countryService.saveCity(this.cityVm).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('City Added Successfully');
      this.GetAllCities(this.stateId);
    }, error => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error(error.error.message);
    });
  }

  showCity(city: City){
    this.cityDetail.controls['id'].setValue(city.id);
    this.cityDetail.controls['name'].setValue(city.name);
    this.cityDetail.controls['regionId'].setValue(city.regionId);
    this.cityDetail.controls['regionName'].setValue(city.regionName);
  }
  updateCity(){
    let edit = this.cityDetail.value;
    this.cityVm = edit;
    this.countryService.updateCity(edit.id, this.cityVm).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('City updated Successfully');
      this.GetAllCities(this.stateId);
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

  deleteCity(city : City) : void
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
        this.countryService.deleteCity(city.id).subscribe(next => {
          this.toastr.success("City deleted Successfully");
          this.GetAllCities(city.regionId);
        }, error => {
          this.toastr.error(error.error.message);
          this.GetAllCities(city.regionId);
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
