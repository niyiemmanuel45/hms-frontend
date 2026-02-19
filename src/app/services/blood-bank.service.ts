import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { BloodGroupDto, BloodGroups } from '../models/hospital';

@Injectable({
  providedIn: 'root'
})
export class BloodBankService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<BloodGroups> {
    return this.http.get<BloodGroups>(`${this.baseUrl}api/BloodBanks/`+ Id);
  }

  GetAll(pagination: Pagination): Observable<PaginatedResult<BloodGroups>>
  {
    return this.http.get<PaginatedResult<BloodGroups>>(`${this.baseUrl}api/BloodBanks?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetBloodGroups(): Observable<PaginatedResult<BloodGroups>>
  {
    return this.http.get<PaginatedResult<BloodGroups>>(`${this.baseUrl}api/BloodBanks`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: BloodGroupDto) {
    return this.http.post(this.baseUrl + 'api/BloodBanks/create', model);
  }

  Update(id: number, edit: BloodGroupDto) {
    return this.http.put(this.baseUrl + 'api/BloodBanks/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/BloodBanks/'+ id);
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
