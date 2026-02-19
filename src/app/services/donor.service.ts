import { Injectable } from '@angular/core';
import { Donor, DonorDto } from '../models/donor';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.baseUrl}api/Donor/`+ Id);
  }

  GetAll(search: string, pagination: Pagination): Observable<PaginatedResult<Donor>>
  {
    return this.http.get<PaginatedResult<Donor>>(`${this.baseUrl}api/Donor?Fullname=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: DonorDto) {
    return this.http.post(this.baseUrl + 'api/Donor/create', model);
  }

  Update(id: number, edit: DonorDto) {
    return this.http.put(this.baseUrl + 'api/Donor/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Donor/'+ id);
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
