import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-org-logo',
  templateUrl: './org-logo.component.html',
  styleUrls: ['./org-logo.component.css']
})
export class OrgLogoComponent {
  organization : Hospital;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;

   myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute,
    private router: Router,
    private orgService: HospitalService,
    private toastr: ToastrService){}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
    });
  }

  get f(){
    return this.myForm.controls;
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFiles = event.target.files;

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.myForm.patchValue({
          fileSource: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  submit(){
    const file: File | null = this.selectedFiles?.item(0)!;
    this.currentFile = file;
    this.orgService.UploadLogo(this.organization.id, this.currentFile)
      .subscribe((response: any) => {
        if(response.status == 200){
          this.toastr.success('Logo uploaded successfully');
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
