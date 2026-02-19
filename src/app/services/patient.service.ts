import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BloodGroups } from '../models/hospital';
import { PaginatedResult } from '../models/pagination';
import { AddPatientDto, UpdatePatientDto } from '../models/staff';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetBloodGroups(): Observable<PaginatedResult<BloodGroups>>
  {
    return this.http.get<PaginatedResult<BloodGroups>>(`${this.baseUrl}api/BloodBanks`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: AddPatientDto) {
    return this.http.post(this.baseUrl + 'api/Account/register-patient', model);
  }

  Update(id: string, model: UpdatePatientDto) {
    return this.http.post(this.baseUrl + 'api/Users/update_user/'+ id, model);
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
