import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Case, CaseDto } from '../models/case';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Case> {
    return this.http.get<Case>(`${this.baseUrl}api/Cases/`+ Id);
  }

  GetAll(id: string, pagination: Pagination): Observable<PaginatedResult<Case>>
  {
    return this.http.get<PaginatedResult<Case>>(`${this.baseUrl}api/Cases/patient-cases/${id}?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: CaseDto) {
    return this.http.post(this.baseUrl + 'api/Cases/create', model);
  }

  Update(id: number, edit: CaseDto) {
    return this.http.put(this.baseUrl + 'api/Cases/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Cases/'+ id);
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
