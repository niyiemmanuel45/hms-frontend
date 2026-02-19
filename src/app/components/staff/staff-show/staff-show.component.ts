import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-staff-show',
  templateUrl: './staff-show.component.html',
  styleUrls: ['./staff-show.component.css']
})
export class StaffShowComponent {
  staff : Staff;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.staff = data['staff'].responseData;
      console.log(this.staff);
    });
  }
}
