import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddHospitalDto } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-org-create',
  templateUrl: './org-create.component.html',
  styleUrls: ['./org-create.component.css']
})
export class OrgCreateComponent {
  countries: any = [];
  states: any = [];
  cities: any = [];
  details: ICurrentUser[];
  userRoleStatus : string;
  hospital : AddHospitalDto;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;

  constructor(private hospitalServ : HospitalService,
    private fb: FormBuilder,
    private router: Router,
    private countryServ: CountryService,
    private toastr: ToastrService,
    private acct: AccountService) { }

    insertForm: FormGroup;
    name: FormControl;
    code: FormControl;
    slogan: FormControl;
    licenseNumber: FormControl;
    contactName: FormControl;
    emailAddress: FormControl;
    redirectURL: FormControl;
    phoneNumber: FormControl;
    logoURL: FormControl;
    cityId: FormControl;
    websiteURL: FormControl;
    stateId: FormControl;
    countryId: FormControl;
    address: FormControl;

  onChangeCountry(countryId: string) {
    if (countryId) {
      this.countryServ.getStates(countryId).subscribe(
        data => {
          const {items} = data.responseData;
          this.states = items;
        }
      );
    } else {
      this.states = null;
    }
  }

  ngOnInit():void {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    //load all countries
    this.countryServ.getCountries().subscribe(
      data => {
        const {items} = data.responseData;
        this.countries = items;
    });

    this.name = new FormControl('', [Validators.required]);
    this.code = new FormControl('', [Validators.required]);
    this.slogan = new FormControl('', [Validators.required]);
    this.contactName = new FormControl('', [Validators.required]);
    this.emailAddress = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
    this.licenseNumber = new FormControl('', [Validators.required]);
    this.redirectURL = new FormControl('', [Validators.required]);
    this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern("^((\\+234-?)|0)?[0-9]{10}$")]);
    this.countryId = new FormControl('', [Validators.required]);
    this.websiteURL = new FormControl('', [Validators.required]);
    this.stateId = new FormControl('', [Validators.required]);
    this.cityId = new FormControl('', [Validators.required]);
    this.address = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'name': this.name,
      'code': this.code,
      'slogan': this.slogan,
      'address': this.address,
      'contactName': this.contactName,
      'emailAddress': this.emailAddress,
      'websiteURL': this.websiteURL,
      'redirectURL': this.redirectURL,
      'phoneNumber': this.phoneNumber,
      'logoURL': this.logoURL,
      'countryId': this.countryId,
      'stateId': this.stateId,
      'cityId': this.cityId,
      'licenseNumber': this.licenseNumber
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
    this.hospital = this.insertForm.value;
    const file: File | null = this.selectedFiles?.item(0)!;
    if(file === undefined){
      this.currentFile = null!;
    }else{
      this.currentFile = file;
    }
    this.hospital.logoURL = this.currentFile;
    if(this.hospital.countryId == '0'){
      this.toastr.error('Select a country');
      this.router.navigate(['/feed/hospital/create']);
    }
    // console.log(this.currentFile);
    // console.log(this.hospital);
    this.hospitalServ.Insert(this.hospital, this.currentFile).subscribe((res: any) => {
      if(res.status == 200){
        this.toastr.success('Hospital created successfully');
        this.router.navigate(['/feed/hospital']);
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
