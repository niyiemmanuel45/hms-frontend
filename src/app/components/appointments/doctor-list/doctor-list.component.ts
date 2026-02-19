import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment } from 'src/app/models/appointment';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { PaginatedResult } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent {
  @ViewChild('fullCalendar') calendarComponent: FullCalendarComponent | undefined;
  cases : Appointment[] = [];
  case : Appointment;
  userId : string;
  user : User = new User();
  userRoleStatus : string;
  details: ICurrentUser[];

  dateForm: FormGroup;
  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: (arg) => this.handleEventClick(arg),
    // dateClick: (arg) => this.handleDateClick(arg),
    events: [],
    eventContent: this.renderEventContent.bind(this), // Custom event rendering
  };

  constructor(private caseServ : AppointmentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private acct: AccountService) { 
      this.dateForm = this.fb.group({
        selectedDate: [''] // Form control for date input
      });
    }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.userId = this.user.userId;
      // console.log(this.user);
      this.loadEvents(this.user.userId);
    });  

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    // Listen for date changes and navigate FullCalendar accordingly
    this.dateForm.get('selectedDate')?.valueChanges.subscribe((date) => {
      if (date) {
        this.navigateToDate(date);
      }
    });

  }

  loadEvents(id:string) {
    this.caseServ.DoctorsAppointment(id)
      .subscribe((response: PaginatedResult<Appointment>) => {
        this.cases = response.responseData.items as Appointment[];
        // console.log(this.cases);
        const mappedEvents = this.cases.map(event => ({
          title: event.status,
          // date: this.formatDate(event.date),
          date: event.date,
          mid: event.id,
          dated: event.date,
          patient: event.patient.name,
          doctor: event.doctor.name,
        }));

        // console.log(mappedEvents);

        this.calendarOptions = {
          ...this.calendarOptions,
          events: mappedEvents
        };
    },error => {
      console.error('Error fetching events:', error);
    });
  }

  navigateToDate(date: string) {
    const parsedDate = new Date(date);

    // Ensure calendarComponent is initialized before calling getApi()
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.gotoDate(parsedDate); // Navigate FullCalendar to the selected date
    }
  }

  handleDateClick(arg: any):void {
    alert('date click! ' + arg.dateStr)
  }

  handleEventClick(arg: any) {
    // Log the whole event object to inspect
    // console.log('Event clicked:', arg.event);

    // Extract the event title, start date, and description
    const eventTitle = arg.event.title;
    const eventStartDate = arg.event.startStr; // Start date as string
    const mid = arg.event.extendedProps.mid;
    // const dated = arg.event.extendedProps.dated;
    // const doctor = arg.event.extendedProps.doctor;
    const eventDescription = arg.event.extendedProps.patient; // Description from extended properties

    // Display the event details in an alert (or use in your app as needed)
    // alert(`Event: ${eventTitle}\nStart Date: ${eventStartDate}\nDescription: ${eventDescription}\nMid: ${mid}`);
    this.router.navigate(['/feed/appointment', mid]);
  }

  renderEventContent(eventInfo: any) {
    // console.log('Formatted info:', eventInfo);
    return {
      html: `<b>Status: ${eventInfo.event.title}</b>
      <br/><i>Date: ${eventInfo.event.extendedProps.dated}</i>
      <br/><i>Patient: ${eventInfo.event.extendedProps.patient}</i>
      <br/><i>Doctor: ${eventInfo.event.extendedProps.doctor}</i>` 
    };
  }
  
  formatDate(dateString: string): string {
    if (!dateString) {
      // console.error('Date is undefined:', dateString); // Log if date is undefined
      return ''; // Handle the case when date is undefined
    }
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0]; // Convert to "YYYY-MM-DD"
    // console.log('Formatted date:', formattedDate); // Log to check the formatted date
    return formattedDate;
  }
}
