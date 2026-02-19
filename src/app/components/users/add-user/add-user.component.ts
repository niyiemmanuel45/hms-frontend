import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { User, Roles } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CountryService } from 'src/app/services/country.service';
import { UserService } from 'src/app/services/user.service';
import { UserDto } from 'src/app/viewModel/userDto';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  organization : Hospital;
  user: User = new User();
  userRoleStatus : string;
  insertUser : UserDto;
  cities: any = [];
  role: any = [];
  roleworker: any = [];
  details: ICurrentUser[];
  genders: string[] = ['Male', 'Female'];
  orgId : number;
  url: string;

  insertForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  username: FormControl;
  middleName: FormControl;
  email: FormControl;
  phoneNumber: FormControl;
  gender: FormControl;
  houseNumber: FormControl;
  streetAddress: FormControl;
  nearestBustop: FormControl;
  cityId: FormControl;
  organizationId: FormControl;
  roles: FormControl;
  dataarray: any[] = [];

  constructor(private userService : UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private countryServ: CountryService,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.orgId = this.organization.id;

      this.countryServ.getCities(this.organization.state.id).subscribe(
        data => {
          const {items} = data.responseData;
          this.cities = items;
        }
      );
    });
    this.url = this.router.url;

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});

    this.userService.GetRoles().subscribe(
      (data: Roles) => {
        this.role = data;
    });
    this.userService.GetRolesForWorkers().subscribe(
      (data: Roles) => {
        this.roleworker = data;
    });

    this.userRoleStatus = strArr[4];

    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.username = new FormControl('', [Validators.required]);
    this.middleName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.phoneNumber = new FormControl('', [Validators.required]);
    this.houseNumber = new FormControl('', [Validators.required]);
    this.gender = new FormControl('', [Validators.required]);
    this.streetAddress = new FormControl('', [Validators.required]);
    this.nearestBustop = new FormControl('', [Validators.required]);
    this.cityId = new FormControl('', [Validators.required]);
    this.roles = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'username': this.username,
      'middleName': this.middleName,
      'email': this.email,
      'phoneNumber': this.phoneNumber,
      'houseNumber': this.houseNumber,
      'gender': this.gender,
      'streetAddress': this.streetAddress,
      'nearestBustop': this.nearestBustop,
      'cityId': this.cityId,
      'roles': this.roles
    });
  }

  AddUser() {
    this.insertUser = this.insertForm.value;
    this.insertUser.organizationId = this.orgId;
    let roleSelected = this.insertForm.value.roles;
    this.dataarray.push(roleSelected);
    this.insertUser.roles = this.dataarray;
    this.userService.addUser(this.insertUser).subscribe(() => {
      this.toastr.success('User added successfully');
      this.router.navigate(['/feed/admin-users', this.orgId]);
    }, error => {
      // console.log(error);
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error.error);
      }
    });
  }
}
