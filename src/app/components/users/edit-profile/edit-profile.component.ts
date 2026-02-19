import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/models/city';
import { Country } from 'src/app/models/country';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Region } from 'src/app/models/region';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  user: User = new User();
  @ViewChild('editForm') editForm: NgForm | undefined;
  countries: any = [];
  states: any = [];
  cities: any = [];
  userRoleStatus: string;
  SelectedCountryId:Country;
  SelectedStateId:Region;
  SelectedCityId:City;
  details: ICurrentUser[];

  genders: string[] = ['Male', 'Female'];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private countryServ: CountryService,
    private userService: UserService,
    private toastr: ToastrService,
    private acct: AccountService){}

    ngOnInit() {
      this.route.data.subscribe(data => {
        this.user = data['user'];
        // console.log(this.user);
      });
      this.details = this.acct.TokenDecodeUserDetail();
      var strArr = this.details.map(function(e){return e.toString()});
      this.userRoleStatus = strArr[4];

      //get list of cities
      this.details = this.acct.TokenDecodeUserDetail();
      var strArr = this.details.map(function(e){return e.toString()});
      this.userService.getUserById(strArr[0]).subscribe(
        data => {
          this.user = data;
          this.countryServ.getCities(this.user.hospital?.state.id!).subscribe(
            data => {
              const {items} = data.responseData;
              this.cities = items;
              // console.log(this.cities);
            }
          );
      });
    }

    updateUser() {
      let edituser = this.editForm?.value;
      // console.log(edituser);
      if(edituser.cityId == null){
        if(this.user.city.id != null){
          edituser.cityId = this.user.city.id;
        }else{
          this.toastr.error("City field is required!");
        }
      }
      this.userService.updateUser(edituser.id, edituser).subscribe(next => {
        this.toastr.success('Profile updated Successfully');
        this.router.navigate(['/feed/profile', edituser.id]);
        // this.editForm?.reset(this.user);
      }, error => {
        // console.log(error);
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
