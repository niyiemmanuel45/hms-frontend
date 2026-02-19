import { Injectable } from '@angular/core';
import { Category, CategoryDto } from '../models/category';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}api/Category/`+ Id);
  }

  GetAll(search: string, pagination: Pagination): Observable<PaginatedResult<Category>>
  {
    return this.http.get<PaginatedResult<Category>>(`${this.baseUrl}api/Category?Name=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }


  GetAllWithoutPage(): Observable<PaginatedResult<Category>>
  {
    return this.http.get<PaginatedResult<Category>>(`${this.baseUrl}api/Category`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: CategoryDto) {
    return this.http.post(this.baseUrl + 'api/Category/create', model);
  }

  Update(id: number, edit: CategoryDto) {
    return this.http.put(this.baseUrl + 'api/Category/update/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Category/'+ id);
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
