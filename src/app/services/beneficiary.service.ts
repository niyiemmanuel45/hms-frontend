import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { AddBeneficiary, Beneficiary } from '../models/beneficiary';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getById(Id: number): Observable<Beneficiary> {
    return this.http.get<Beneficiary>(`${this.baseUrl}api/Beneficiary/`+ Id);
  }

  getByHospitalId(tenantId: number, pagination: Pagination): Observable<PaginatedResult<Beneficiary>>
  {
    return this.http.get<PaginatedResult<Beneficiary>>(`${this.baseUrl}api/Beneficiary/hospital/${tenantId}?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetAll(pagination: Pagination): Observable<PaginatedResult<Beneficiary>>
  {
    return this.http.get<PaginatedResult<Beneficiary>>(`${this.baseUrl}api/Beneficiary?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: AddBeneficiary) {
    return this.http.post(this.baseUrl + 'api/Beneficiary/create', model);
  }

  Update(id: number, edit: AddBeneficiary) {
    return this.http.put(this.baseUrl + 'api/Beneficiary/update/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Beneficiary/'+ id);
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
