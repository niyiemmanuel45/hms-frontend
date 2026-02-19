import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bed, BedAllotment, BedAllotmentDto, BedDto } from '../models/bed';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Appointment, AppointmentDto, AppointmentStatusDto } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}api/Appointments/`+ Id);
  }

  GetAll(pagination: Pagination, filters: any): Observable<PaginatedResult<Appointment>>
  {
    let params = new HttpParams()
      .set('pageNumber', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

      // Add filter parameters dynamically
      for (const key in filters) {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      }
    return this.http.get<PaginatedResult<Appointment>>(`${this.baseUrl}api/Appointments`, { params })
    .pipe(catchError(this.handleError));
  }


  PatientAppointment(id: string, pagination: Pagination, filters: any): Observable<PaginatedResult<Appointment>>
  {
    let params = new HttpParams()
      .set('pageNumber', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

      // Add filter parameters dynamically
      for (const key in filters) {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      }
    return this.http.get<PaginatedResult<Appointment>>(`${this.baseUrl}api/Appointments/patient-appointment/${id}`, { params })
    .pipe(catchError(this.handleError));
  }

  DoctorsAppointment(id: string): Observable<PaginatedResult<Appointment>>
  {
    return this.http.get<PaginatedResult<Appointment>>(`${this.baseUrl}api/Appointments/doctor-appointment/${id}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: AppointmentDto) {
    return this.http.post(this.baseUrl + 'api/Appointments/book-an-appointment', model);
  }

  Update(id: number, edit: AppointmentDto) {
    return this.http.put(this.baseUrl + 'api/Appointments/'+ id, edit);
  }
     
  ConfirmAppointment(model: AppointmentStatusDto) {
    return this.http.put(this.baseUrl + 'api/Appointments/confirm-appointment', model);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Appointments/'+ id);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(() => error);
  }
}
