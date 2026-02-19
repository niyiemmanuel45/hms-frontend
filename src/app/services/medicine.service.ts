import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Medicine, MedicineDto } from '../models/medicine';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.baseUrl}api/Medicine/`+ Id);
  }

  GetAll(search: string, pagination: Pagination): Observable<PaginatedResult<Medicine>>
  {
    return this.http.get<PaginatedResult<Medicine>>(`${this.baseUrl}api/Medicine?Name=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetAllByCode(code: string, pagination: Pagination): Observable<PaginatedResult<Medicine>>
  {
    return this.http.get<PaginatedResult<Medicine>>(`${this.baseUrl}api/Medicine/by-hospital/${code}?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetAllWithoutPage(): Observable<PaginatedResult<Medicine>>
  {
    return this.http.get<PaginatedResult<Medicine>>(`${this.baseUrl}api/Medicine`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: MedicineDto) {
    return this.http.post(this.baseUrl + 'api/Medicine/create', model);
  }

  Update(id: number, edit: MedicineDto) {
    return this.http.put(this.baseUrl + 'api/Medicine/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Medicine/'+ id);
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
