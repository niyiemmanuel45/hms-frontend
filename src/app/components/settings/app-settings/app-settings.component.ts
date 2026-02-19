import { Component, ViewChild } from '@angular/core';
import { FormArray, NgForm, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { SettingVM } from 'src/app/viewModel/organizationVM';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent {
  settingsForm: FormArray = this.fb.array([]);
  setting = new SettingVM();
  dataarray: any[] = [];
  configurations: any[];
  setting_name: string = "";

  @ViewChild('editForm') editForm: NgForm | undefined;
  constructor(private fb: FormBuilder,
    private appSettings : AppSettingsService,
    private toastr: ToastrService){}

  ngOnInit() {
    this.GetAllSettings();
    this.dataarray.push(this.setting);
  }

  GetAllSettings(){
    this.appSettings.GetAppSettings()
      .subscribe((response : any)  => {
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
    var obj = Object.assign([], processedData)
    const payload = obj;
    if(this.setting_name == ""){
      this.toastr.error("Setting name field cannot be empty!");
    }
    // console.log({"settings": payload, "name" : this.setting_name});
    this.appSettings.AddAppSettings({"settings": payload, "name" : this.setting_name}).subscribe(() => {
      this.toastr.success('App configuration settings added successfully');
      this.dataarray.splice(1);
      this.GetAllSettings();
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

  EditConfig(id: string) : void
  {

  }

  deleteConfig(id: number) : void
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
        this.appSettings.DeleteAppSettings(id).subscribe(next => {
          this.toastr.success('App configuration settings deleted Successfully');
          this.GetAllSettings();
        }, error => {
          this.toastr.error(error.message);
          this.GetAllSettings();
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
