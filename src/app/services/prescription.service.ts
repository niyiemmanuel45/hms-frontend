import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Prescription, PrescriptionDto } from '../models/prescription';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.baseUrl}api/Prescription/`+ Id);
  }

  GetAll(pagination: Pagination, filters: any): Observable<PaginatedResult<Prescription>>
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
    return this.http.get<PaginatedResult<Prescription>>(`${this.baseUrl}api/Prescription`, { params })
    .pipe(catchError(this.handleError));
  }


  PatientPrescription(id: string, pagination: Pagination, filters: any): Observable<PaginatedResult<Prescription>>
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
    return this.http.get<PaginatedResult<Prescription>>(`${this.baseUrl}api/Prescription/patient-prescription/${id}`, { params })
    .pipe(catchError(this.handleError));
  }

  Insert(payload: any) {
    return this.http.post(this.baseUrl + 'api/Prescription/create', payload);
  }

  Update(id: number, edit: PrescriptionDto) {
    return this.http.put(this.baseUrl + 'api/Prescription/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Prescription/'+ id);
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
