import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Bed, BedAllotment, BedAllotmentDto, BedDto } from '../models/bed';

@Injectable({
  providedIn: 'root'
})
export class BedService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Bed> {
    return this.http.get<Bed>(`${this.baseUrl}api/Beds/`+ Id);
  }

  GetAll(pagination: Pagination): Observable<PaginatedResult<Bed>>
  {
    return this.http.get<PaginatedResult<Bed>>(`${this.baseUrl}api/Beds?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetAllWithoutPage(): Observable<PaginatedResult<Bed>>
  {
    return this.http.get<PaginatedResult<Bed>>(`${this.baseUrl}api/Beds`)
    .pipe(catchError(this.handleError));
  }

  PatientAllotment(id: string, pagination: Pagination): Observable<PaginatedResult<BedAllotment>>
  {
    return this.http.get<PaginatedResult<BedAllotment>>(`${this.baseUrl}api/BedAllotment/patient_bed/${id}?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  InsertAllotment(model: BedAllotmentDto) {
    return this.http.post(this.baseUrl + 'api/BedAllotment/allot-bed-patient', model);
  }

  DischargePatient(id: number) {
    return this.http.put(this.baseUrl + `api/BedAllotment/discharge-patients/${id}`, {});
  }

  Insert(model: BedDto) {
    return this.http.post(this.baseUrl + 'api/Beds/create', model);
  }

  Update(id: number, edit: BedDto) {
    return this.http.put(this.baseUrl + 'api/Beds/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Beds/'+ id);
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
