import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppSettingsService } from 'src/app/services/app-settings.service';

@Component({
  selector: 'app-site-cryptography',
  templateUrl: './site-cryptography.component.html',
  styleUrls: ['./site-cryptography.component.css']
})
export class SiteCryptographyComponent {
  isLoading : boolean =  true;
  isdecptLoad : boolean =  true;
  message : string;
  message_decrpty : string;

  constructor(private settingService : AppSettingsService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { }

  encryptForm = this.formBuilder.group({
    encrypt: ''
  });

  decryptForm = this.formBuilder.group({
    decrypt: ''
  });

  ngOnInit():void{

  }

  onSubmit(): void {
    if(this.encryptForm.value.encrypt == ""){
      this.isLoading = true;
      this.toastr.error('Encrypt text field cannot be empty');
    }else{
      this.settingService.Encrpyt(this.encryptForm.value.encrypt!).subscribe(
        (data : any) => {
          const result = data.responseData;
          console.warn(result);
          this.isLoading = false;
          this.message = result;
          this.encryptForm.reset();
        }, error => {
          if(error.length > 0){
            for(let err in error){
              this.toastr.error(error[err]);
            }
          }else{
            this.toastr.error(error);
          }
        }
      );
    }
  }

  onDecrypt(): void {
    if(this.decryptForm.value.decrypt == ""){
      this.isdecptLoad = true;
      this.toastr.error('Decrypt text field cannot be empty');
    }else{
      this.settingService.Decrpyt(this.decryptForm.value.decrypt!).subscribe(
        (res : any) => {
          const data = res.responseData;
          this.isdecptLoad = false;
          this.message_decrpty = data;
          this.decryptForm.reset();
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
}
