import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICurrentUser } from './models/icurrent-user';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hms-client';
  details: ICurrentUser[];
  currentUser: User = new User();

  constructor(private acct: AccountService,
    private router : Router,
    private userService: UserService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    if(strArr[0] === undefined){
      this.acct.logout();
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUserById(strArr[0])
      .subscribe((response: User) => {
        this.currentUser = response;
        this.acct.setCurrentUser(this.currentUser);
    });
  }
}
