import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital, UpdateHospitalDto } from 'src/app/models/hospital';
import { CountryService } from 'src/app/services/country.service';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.css']
})
export class OrgEditComponent {
  countries: any = [];
  states: any = [];
  cities: any = [];
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
    private toastr: ToastrService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.hospital = data['organization'].responseData;
      this.hospitalId = this.hospital.id;
      // console.log(this.hospital);
    });

    //load all countries
    this.countryServ.getCountries().subscribe(
      data => {
        const {items} = data.responseData;
        this.countries = items;
    });
  }

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
      this.router.navigate(['/feed/hospital/edit', this.hospitalId]);
    }

    if(edituser.cityId == null){
      if(this.hospital.city.id != null){
        edituser.cityId = this.hospital.city.id;
      }else{
        this.toastr.error("City field is required!");
      }
    }

    if(edituser.stateId == null){
      if(this.hospital.state.id != null){
        edituser.stateId = this.hospital.state.id;
      }else{
        this.toastr.error("State field is required!");
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
    // console.log(JSON.stringify(update));

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
