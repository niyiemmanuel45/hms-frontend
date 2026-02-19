import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent {
  appointment : Appointment;

  @ViewChild('editForm') editForm: NgForm | undefined;

  constructor(private route: ActivatedRoute,
    private apptServ : AppointmentService){}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.appointment = data['appointment'].responseData;
      // console.log(this.appointment);
    });
  }
}
