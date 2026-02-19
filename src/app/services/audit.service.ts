import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Audit } from '../models/audit';
import { PaginatedResult, Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  constructor(private http : HttpClient) { }

    baseUrl = environment.apiUrl;
    private audit$: Observable<Audit[]>;

    getAudits(search: string, pagination: Pagination): Observable<PaginatedResult<Audit>>
    {
      return this.http.get<PaginatedResult<Audit>>(`${this.baseUrl}api/Audit?CreatedBy=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
      .pipe(catchError(this.handleError));
    }

    getAuditById(id: number) : Observable<Audit>
    {
      return this.http.get<Audit>(`${this.baseUrl}api/Audit/${id}`).pipe(
        catchError(this.handleError)
      );
    }

    UpdateAudit() : Observable<string>
    {
      return this.http.get<string>(`${this.baseUrl}api/Audit/update`).pipe(
        catchError(this.handleError)
      );
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
