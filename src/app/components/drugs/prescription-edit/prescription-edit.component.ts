import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prescription } from 'src/app/models/prescription';

@Component({
  selector: 'app-prescription-edit',
  templateUrl: './prescription-edit.component.html',
  styleUrls: ['./prescription-edit.component.css']
})
export class PrescriptionEditComponent {
  prescription : Prescription;
  userRoleStatus : string;
  Id: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.prescription = data['prescription'].responseData;
      // console.log(this.prescription);
    });
    this.route.params.subscribe(p => {
      this.Id = p['id'];
    });
  }
}
