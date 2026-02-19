import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Lga } from 'src/app/models/city';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-lga-logo',
  templateUrl: './lga-logo.component.html',
  styleUrls: ['./lga-logo.component.css']
})
export class LgaLogoComponent {
  lga : Lga;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;
  tId: number;

   myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private toastr: ToastrService){}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.lga = data['lga'].responseData;
    });
    this.route.params.subscribe(p => {
      this.tId = +p['tid'];
      // console.log(this.tId);
    })
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
    this.countryService.UploadLogo(this.lga.id, this.currentFile)
      .subscribe((response: any) => {
        if(response.status == 200){
          this.toastr.success('Logo uploaded successfully');
          this.router.navigate(['/feed/lga', this.tId]);
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
