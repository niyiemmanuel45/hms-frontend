import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Department, DepartmentDto } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}api/Departments/`+ Id);
  }

  GetAll(search: string, pagination: Pagination): Observable<PaginatedResult<Department>>
  {
    return this.http.get<PaginatedResult<Department>>(`${this.baseUrl}api/Departments?Name=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }


  GetAllWithoutPage(): Observable<PaginatedResult<Department>>
  {
    return this.http.get<PaginatedResult<Department>>(`${this.baseUrl}api/Departments`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: DepartmentDto) {
    return this.http.post(this.baseUrl + 'api/Departments/create', model);
  }

  Update(id: number, edit: DepartmentDto) {
    return this.http.put(this.baseUrl + 'api/Departments/update/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Departments/'+ id);
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
