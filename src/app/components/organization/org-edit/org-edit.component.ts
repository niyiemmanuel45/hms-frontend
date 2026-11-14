import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital, UpdateHospitalDto } from 'src/app/models/hospital';
import { Lga } from 'src/app/models/city';
import { User } from 'src/app/models/user';
import { CountryService } from 'src/app/services/country.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.css']
})
export class OrgEditComponent {
  countries: any = [];
  states: any = [];
  cities: any = [];
  lgas: Lga[] = [];
  countryId: string;
  stateId: string;
  cityId: string;
  lgaId: string;
  tenantId: string;
  hospital : Hospital;
  hospitalId : number;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;

  @ViewChild('editForm') editForm: NgForm | undefined;

  constructor(private route: ActivatedRoute,
    private hospitalServ : HospitalService,
    private countryServ: CountryService,
    private router: Router,
    private toastr: ToastrService,
    private acct: AccountService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.hospital = data['organization'].responseData;
      this.hospitalId = this.hospital.id;
      // the API response has no country/state on the hospital record, so
      // pre-populate what we can: city & lga
      this.cityId = this.hospital?.city?.id || '';
      this.lgaId = this.hospital?.lga?.id ? String(this.hospital.lga.id) : '';
      this.countryId = '0';
      this.stateId = '';
      if (this.cityId) {
        this.loadLgas(this.cityId);
      }
    });

    // capture the tenant the current user belongs to
    this.tenantId = this.acct.currentUser?.tenantId;
    this.acct.currentUser$.subscribe((user: User | null) => {
      if (user && user.tenantId) {
        this.tenantId = user.tenantId;
      }
    });

    //load all countries
    this.countryServ.getCountries().subscribe(
      data => {
        const {items} = data.responseData;
        this.countries = items;
    });
  }

  onChangeCountry(countryId: string) {
    // reset the dependent dropdowns
    this.stateId = '';
    this.cityId = '';
    this.lgaId = '';
    this.cities = null;
    this.lgas = [];

    if (countryId && countryId !== '0') {
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

  onChangeCity(stateId: string) {
    // reset the dependent dropdowns
    this.cityId = '';
    this.lgaId = '';
    this.lgas = [];

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

  onChangeLga(cityId: string) {
    // reset the LGA selection, then load the LGAs for the chosen city
    this.lgaId = '';

    if (cityId) {
      this.loadLgas(cityId);
    } else {
      this.lgas = [];
    }
  }

  loadLgas(cityId: string) {
    this.countryServ.GetLgasWithoutPage(cityId).subscribe(
      data => {
        const {items} = data.responseData;
        this.lgas = (items || []).map((lga: any) => ({ ...lga, id: String(lga.id) }));
        if (this.lgas.length === 0) {
          this.toastr.info('No LGAs available for this city yet');
        }
      },
      error => {
        this.lgas = [];
        console.error('Unable to load LGAs', error);
        this.toastr.error('Unable to load LGAs, please try again');
      }
    );
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFiles = event.target.files;

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.editForm?.form.patchValue({
          fileSource: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  UpdateOrg(){
    let edituser = this.editForm?.value;
    const file: File | null = this.selectedFiles?.item(0)!;
    if(file === undefined){
      this.currentFile = null!;
    }else{
      this.currentFile = file;
    }

    if(edituser.countryId == '0'){
      this.toastr.error('Select a country');
      return;
    }

    if(!edituser.cityId){
      if(this.hospital?.city?.id){
        edituser.cityId = this.hospital.city.id;
      }else{
        this.toastr.error("City field is required!");
        return;
      }
    }

    if(!edituser.lgaId){
      if(this.hospital?.lga?.id){
        edituser.lgaId = String(this.hospital.lga.id);
      }else{
        this.toastr.error("LGA field is required!");
        return;
      }
    }

    // console.log(this.currentFile);
    // console.log(edituser);

    let update = new UpdateHospitalDto();
    update.name = edituser.name;
    update.code = edituser.code;
    update.slogan = edituser.slogan;
    update.emailAddress = edituser.emailAddress;
    update.phoneNumber = edituser.phoneNumber;
    update.redirectURL = edituser.redirectURL;
    update.websiteURL = edituser.websiteURL;
    update.address = edituser.address;
    update.licenseNumber = edituser.licenseNumber;
    update.contactName = edituser.contactName;
    update.cityId = edituser.cityId;
    update.stateId = edituser.stateId;
    update.countryId = edituser.countryId;
    update.lgaId = edituser.lgaId;
    update.tenantId = this.tenantId || this.acct.currentUser?.tenantId;

    this.hospitalServ.Update(this.hospitalId, update, this.currentFile).subscribe(next => {
      this.toastr.success('Hospital updated successfully!');
      this.router.navigate(['/feed/hospital']);
    }, error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
          this.router.navigate(['/feed/hospital/edit', this.hospitalId]);
        }
      }else{
        this.toastr.error(error);
        this.router.navigate(['/feed/hospital/edit', this.hospitalId]);
      }
    });
  }
}
