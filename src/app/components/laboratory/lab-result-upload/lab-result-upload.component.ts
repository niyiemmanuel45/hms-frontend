import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LabReport } from 'src/app/models/test-type';
import { TestTypeService } from 'src/app/services/test-type.service';

@Component({
  selector: 'app-lab-result-upload',
  templateUrl: './lab-result-upload.component.html',
  styleUrls: ['./lab-result-upload.component.css']
})
export class LabResultUploadComponent {
  lab : LabReport;
  userRoleStatus : string;
  tId: number;
  Id: string;

  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;

   myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private testServ : TestTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.lab = data['report'];
      // console.log(this.lab.id);
    });  
    this.route.params.subscribe(p => {
      this.Id = p['id'];
    });
    this.route.params.subscribe(p => {
      this.tId = +p['tid'];
    });
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
    // console.log(this.currentFile);
    this.testServ.UploadLabResult(this.tId, this.currentFile)
      .subscribe((response: any) => {
        if(response.status == 200){
          this.toastr.success('Test result uploaded successfully');
          this.router.navigate(['/feed/patient/lab-report', this.Id]);
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
