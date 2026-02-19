import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AddPatientDto, UpdatePatientDto } from 'src/app/models/staff';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {
  organization : Hospital;
  orgId : number;
  users : User[] = [];
  userRoleStatus : string;
  details: ICurrentUser[];
  searchText: string = "";
  pagination: Pagination = new Pagination(1, 0, 6, [10, 20, 30, 40]);
  pageSizeOptions: number[] = [10, 20, 50, 100];
  userDetail !: FormGroup;
  addPatient: AddPatientDto;
  updatePatientDto: UpdatePatientDto;
  genders: string[] = ['Male', 'Female'];
  states: any = [];
  cities: any = [];
  bloodGroups: any = [];
  patientDetail !: FormGroup;


  insertForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  middleName: FormControl;
  email: FormControl;
  username: FormControl;
  phoneNumber: FormControl;
  houseNumber: FormControl;
  streetAddress: FormControl;
  nearestBustop: FormControl;
  gender: FormControl;
  dob: FormControl;
  occupation: FormControl;
  cityId: FormControl;
  regionId: FormControl;
  bloodGroupId: FormControl;
  hospitalId: FormControl;

  constructor(private userService : UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private countryServ: CountryService,
    private patientServ: PatientService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe((data : any) => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;
      this.GetAllUsers(this.organization.id);
    });

    this.countryServ.getRegions().subscribe(
      data => {
        const {items} = data.responseData;
        this.states = items;
    });

    this.patientServ.GetBloodGroups().subscribe(
      data => {
        const {items} = data.responseData;
        this.bloodGroups = items;
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.middleName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
    this.username = new FormControl('', [Validators.required]);
    this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern("^((\\+234-?)|0)?[0-9]{10}$")]);
    this.houseNumber = new FormControl('', [Validators.required]);
    this.streetAddress = new FormControl('', [Validators.required]);
    this.nearestBustop = new FormControl('', [Validators.required]);
    this.gender = new FormControl('', [Validators.required]);
    this.dob = new FormControl('', [Validators.required]);
    this.occupation = new FormControl('', [Validators.required]);
    this.cityId = new FormControl('', [Validators.required]);
    this.regionId = new FormControl('', [Validators.required]);
    this.bloodGroupId = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'middleName': this.middleName,
      'email': this.email,
      'username': this.username,
      'phoneNumber': this.phoneNumber,
      'houseNumber': this.houseNumber,
      'streetAddress': this.streetAddress,
      'nearestBustop': this.nearestBustop,
      'gender': this.gender,
      'dob': this.dob,
      'occupation': this.occupation,
      'cityId': this.cityId,
      'regionId': this.regionId,
      'bloodGroupId': this.bloodGroupId,
      'hospitalId': this.hospitalId
    });

    this.patientDetail = this.fb.group({
      id : [''],
      firstName : [''],
      lastName: [''],
      middleName: [''],
      email: [''],
      username: [''],
      phoneNumber: [''],
      houseNumber: [''],
      streetAddress: [''],
      nearestBusStop: [''],
      gender: [''],
      dob: [''],
      occupation: [''],
      cityId: [''],
      regionId: [''],
      bloodGroupId: ['']
    });
  }

  onChangeCity(stateId: string) {
    if (stateId) {
      this.countryServ.getCities(stateId).subscribe(
        data => {
          const {items} = data.responseData;
          this.cities = items;
        }
      );
    } else {
      this.cities = null;
    }
  }

  AddPatient() {
    this.addPatient = this.insertForm.value;
    this.addPatient.hospitalId = this.orgId;
    // console.log(this.addPatient);
    this.patientServ.Insert(this.addPatient).subscribe(() => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.success('Patient Added Successfully');
      this.GetAllUsers(this.orgId);
    }, error => {
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error(error.error.message);
    });
  }

  GetAllUsers(id: number){
    this.userService.getPatients(id, this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<User>) => {
        this.users = response.responseData.items as User[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
        // console.log(this.users);
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

  Filter(event: any, id: number): any {
    this.searchText =  event.target.value;
    this.userService.getPatients(id, this.searchText.trim(), this.pagination)
      .subscribe((response: PaginatedResult<User>) => {
        this.users = response.responseData.items as User[];
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

  onPageChange(event: any, id: number){
    this.pagination.page = event;
    this.GetAllUsers(id);
  }
  onPageSizeChange(event: any, id: number){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetAllUsers(id);
  }

  UpdateItem(user: User){
    this.patientDetail.controls['id'].setValue(user.userId);
    this.patientDetail.controls['firstName'].setValue(user.firstName);
    this.patientDetail.controls['lastName'].setValue(user.lastName);
    this.patientDetail.controls['middleName'].setValue(user.middleName);
    this.patientDetail.controls['email'].setValue(user.email);
    this.patientDetail.controls['username'].setValue(user.userName);
    this.patientDetail.controls['phoneNumber'].setValue(user.phoneNumber);
    this.patientDetail.controls['houseNumber'].setValue(user.houseNumber);
    this.patientDetail.controls['streetAddress'].setValue(user.streetAddress);
    this.patientDetail.controls['nearestBusStop'].setValue(user.nearestBusStop);
    this.patientDetail.controls['gender'].setValue(user.gender);
    this.patientDetail.controls['dob'].setValue(user.dob);
    this.patientDetail.controls['occupation'].setValue(user.occupation);
    this.patientDetail.controls['cityId'].setValue(user.city.id);
    this.patientDetail.controls['regionId'].setValue(user.region.id);
    this.patientDetail.controls['bloodGroupId'].setValue(user.bloodBank?.id);
  }

  updatePatient(){
    let edit = this.patientDetail.value;
    this.updatePatientDto = edit;
    // console.log(this.updatePatientDto);
    this.patientServ.Update(edit.id, this.updatePatientDto).subscribe(next => {
      document.getElementById("ModalShut")?.click();
      this.toastr.success('Patient updated Successfully');
      this.GetAllUsers(this.orgId);
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

  deleteUser(user : User, id: number) : void
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
        this.userService.deleteUser(user.userId).subscribe(next => {
          this.toastr.success("User deleted Successfully");
          this.GetAllUsers(id);
        }, error => {
          this.toastr.error(error.error.message);
          this.GetAllUsers(id);
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
