import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailNotification, EmailNotificationDto } from '../models/email-notification';
import { PaginatedResult, Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getById(Id: number): Observable<EmailNotification> {
    return this.http.get<EmailNotification>(`${this.baseUrl}api/Mail/`+ Id);
  }

  GetAll(pagination: Pagination): Observable<PaginatedResult<EmailNotification>>
  {
    return this.http.get<PaginatedResult<EmailNotification>>(`${this.baseUrl}api/Mail?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: EmailNotificationDto) {
    return this.http.post(this.baseUrl + 'api/Mail/onboard_provider', model);
  }

  Update(id: number, edit: EmailNotificationDto) {
    return this.http.put(this.baseUrl + 'api/Mail/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Mail/'+ id);
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
