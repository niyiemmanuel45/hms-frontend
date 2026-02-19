import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patients-logo',
  templateUrl: './patients-logo.component.html',
  styleUrls: ['./patients-logo.component.css']
})
export class PatientsLogoComponent {
  user: User = new User();
  userRoleStatus: string;
  imageSrc: string;
  currentFile?: File;
  selectedFiles?: FileList;

   myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService){}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
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
    // console.log(this.myForm.value);
    const file: File | null = this.selectedFiles?.item(0)!;
    this.currentFile = file;
    this.userService.UploadAvatar(this.user.userId, this.currentFile)
      .subscribe((response: any) => {
        if(response.status == 200){
          this.toastr.success('Avatar uploaded successfully');
          this.router.navigate(['/feed/patients', this.user.hospital?.id]);
          setTimeout(function(){
            window.location.reload();
          }, 1000);
        }
    }, error => {
      // console.log(error);
      this.toastr.error(error.error.message);
    });
  }
}
