import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { AddStaffDto } from 'src/app/models/staff';
import { CountryService } from 'src/app/services/country.service';
import { DepartmentService } from 'src/app/services/department.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.css']
})
export class StaffAddComponent {
  states: any = [];
  cities: any = [];
  departments: any = [];
  details: ICurrentUser[];
  userRoleStatus : string;
  hospital : Hospital;
  addDto : AddStaffDto;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;
  genders: string[] = ['Male', 'Female'];

  constructor(private staffServ : StaffService,
    private deptServ: DepartmentService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private countryServ: CountryService,
    private toastr: ToastrService) { }

    insertForm: FormGroup;
    employeeId: FormControl;
    firstName: FormControl;
    lastName: FormControl;
    gender: FormControl;
    userName: FormControl;
    email: FormControl;
    houseNumber: FormControl;
    phoneNumber: FormControl;
    Picture: FormControl;
    cityId: FormControl;
    streetAddress: FormControl;
    stateId: FormControl;
    nearestBusStop: FormControl;
    dob: FormControl;
    departmentId: FormControl;
    staffType: FormControl;

  ngOnInit():void {
    this.route.data.subscribe((data : any) => {
      this.hospital = data['organization'].responseData;
      //load all states
      this.countryServ.getStates(this.hospital.country.id).subscribe(
        data => {
          const {items} = data.responseData;
          this.states = items;
      });
    });

    this.deptServ.GetAllWithoutPage().subscribe(
      data => {
        const {items} = data.responseData;
        this.departments = items;
    });

    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.userName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
    this.employeeId = new FormControl('', [Validators.required]);
    this.gender = new FormControl('', [Validators.required]);
    this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern("^((\\+234-?)|0)?[0-9]{10}$")]);
    this.departmentId = new FormControl('', [Validators.required]);
    this.nearestBusStop = new FormControl('', [Validators.required]);
    this.stateId = new FormControl('', [Validators.required]);
    this.houseNumber = new FormControl('', [Validators.required]);
    this.cityId = new FormControl('', [Validators.required]);
    this.streetAddress = new FormControl('', [Validators.required]);
    this.staffType = new FormControl('', [Validators.required]);
    this.dob = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'email': this.email,
      'userName': this.userName,
      'staffType': this.staffType,
      'streetAddress': this.streetAddress,
      'houseNumber': this.houseNumber,
      'nearestBusStop': this.nearestBusStop,
      'phoneNumber': this.phoneNumber,
      'Picture': this.Picture,
      'departmentId': this.departmentId,
      'stateId': this.stateId,
      'cityId': this.cityId,
      'gender': this.gender,
      'employeeId': this.employeeId,
      'dob': this.dob
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

  onSubmit() {
    this.addDto = this.insertForm.value;
    const file: File | null = this.selectedFiles?.item(0)!;
    if(file === undefined){
      this.currentFile = null!;
    }else{
      this.currentFile = file;
    }
    this.addDto.picture = this.currentFile;
    this.addDto.hospitalId = this.hospital.id;
    // console.log(this.currentFile);
    // console.log(this.addDto);

    if(this.addDto.staffType == 0){
      this.toastr.error('Select a Staff type');
      this.router.navigate(['/feed/staffs/add', this.hospital.id]);
    }
    this.staffServ.Insert(this.addDto, this.currentFile).subscribe((res: any) => {
      if(res.status == 200){
        this.toastr.success('Staff created successfully');
        this.router.navigate(['/feed/staffs', this.hospital.id]);
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
