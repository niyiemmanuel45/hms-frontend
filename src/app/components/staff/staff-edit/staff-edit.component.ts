import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Staff, UpdateStaffDto } from 'src/app/models/staff';
import { CountryService } from 'src/app/services/country.service';
import { DepartmentService } from 'src/app/services/department.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.css']
})
export class StaffEditComponent {
  departments: any = [];
  states: any = [];
  cities: any = [];
  staff : Staff;
  hospitalId : number;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;
  genders: string[] = ['Male', 'Female'];

  @ViewChild('editForm') editForm: NgForm | undefined;

  constructor(private route: ActivatedRoute,
    private staffServ : StaffService,
    private deptServ : DepartmentService,
    private countryServ: CountryService,
    private router: Router,
    private toastr: ToastrService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.staff = data['staff'].responseData;
      this.hospitalId = this.staff.hospital.id;
      // console.log(this.staff);

      this.countryServ.getStates(this.staff.hospital.country.id).subscribe(
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
    // console.log(this.currentFile);
    // console.log(edituser);

    let update = new UpdateStaffDto();
    update.firstName = edituser.firstName;
    update.lastName = edituser.lastName;
    update.email = edituser.email;
    update.phoneNumber = edituser.phoneNumber;
    update.employeeId = edituser.employeeId;
    update.userName = edituser.userName;
    update.gender = edituser.gender;
    update.dob = edituser.dob;
    update.streetAddress = edituser.streetAddress;
    update.houseNumber = edituser.houseNumber;
    update.nearestBusStop = edituser.nearestBusStop;
    update.cityId = edituser.cityId;
    update.stateId = edituser.stateId;
    update.departmentId = edituser.departmentId;
    // console.log(JSON.stringify(update));

    this.staffServ.Update(this.staff.id, update, this.currentFile).subscribe(next => {
      this.toastr.success('Staff updated successfully!');
      this.router.navigate(['/feed/staffs', this.hospitalId]);
    }, error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
          this.router.navigate(['/feed/staffs/edit', this.staff.id]);
        }
      }else{
        this.toastr.error(error);
        this.router.navigate(['/feed/staffs/edit', this.staff.id]);
      }
    });
  }
}
