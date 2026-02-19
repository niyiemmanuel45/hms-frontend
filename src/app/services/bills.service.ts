import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult, SingleResult } from '../models/pagination';
import { Bills, BillsDto } from '../models/bills';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<SingleResult<Bills>> {
    return this.http.get<SingleResult<Bills>>(`${this.baseUrl}api/Bills/`+ Id);
  }

  GetAll(patientId: string, pagination: Pagination): Observable<PaginatedResult<Bills>>
  {
    return this.http.get<PaginatedResult<Bills>>(`${this.baseUrl}api/Bills/patient-bills/${patientId}?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: BillsDto) {
    return this.http.post(this.baseUrl + 'api/Bills/create', model);
  }

  Update(id: number, edit: BillsDto) {
    return this.http.put(this.baseUrl + 'api/Bills/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Bills/'+ id);
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
