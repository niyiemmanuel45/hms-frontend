import { HttpClient, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, Roles } from '../models/user';
import { ChangePassword } from '../viewModel/change-password';
import { UserDto } from '../viewModel/userDto';
import { AddRemoveModel } from '../models/role';
import { PaginatedResult, Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  private user$: Observable<User[]>;

  constructor(private http: HttpClient) { }

  getUsers(search: string, pagination: Pagination): Observable<PaginatedResult<User>>
  {
    return this.http.get<PaginatedResult<User>>(`${this.baseUrl}api/Users?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  getAdminUsers(tenantId: number, search: string, pagination: Pagination): Observable<PaginatedResult<User>>
  {
    return this.http.get<PaginatedResult<User>>(`${this.baseUrl}api/Users/list_admin_users/${tenantId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  getPatients(tenantId: number, search: string, pagination: Pagination): Observable<PaginatedResult<User>>
  {
    return this.http.get<PaginatedResult<User>>(`${this.baseUrl}api/Users/patients/${tenantId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  AllPatients(tenantId: number): Observable<PaginatedResult<User>>
  {
    return this.http.get<PaginatedResult<User>>(`${this.baseUrl}api/Users/patients/${tenantId}`)
      .pipe(catchError(this.handleError));
  }

  getTenantUsers(tenantId: number, search: string, pagination: Pagination): Observable<PaginatedResult<User>>
  {
    return this.http.get<PaginatedResult<User>>(`${this.baseUrl}api/Users/agents/${tenantId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  getUserById(Id: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/Users/'+ Id);
  }
  getUserByName(name: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/Users/get_by_username'+ name);
  }
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'api/Users/get_by_email'+ email);
  }

  addUser(create: UserDto) {
    return this.http.post(this.baseUrl + 'api/Users/add_user', create);
  }

  updateUser(userId: string, editUser: User) {
    return this.http.post(this.baseUrl + 'api/Users/update_user/'+ userId, editUser);
  }

  changePassword(userId: string, model: ChangePassword) {
    return this.http.post(this.baseUrl + 'api/Users/change_password/'+ userId, model);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/Users/delete_user/'+id);
  }

  deleteMultipleUsers(tenantId: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/Users/delete_multiple_users/'+tenantId);
  }

  activateUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/Users/activate_user_account/' +id);
  }

  BlockUserAccount(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/Users/block_unblock_account/' +id);
  }

  ResendLink(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/Users/resend_confirmation_link/' +id);
  }

  ResetPassword(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'api/Users/reset/user/password/' +id);
  }

  SwapUserRole(model: AddRemoveModel) {
    return this.http.post(this.baseUrl + 'api/Role/add-and-remove', model);
  }

  GetRoles(): Observable<Roles>
  {
    return this.http.get<Roles>(this.baseUrl + 'api/Role');
  }
  GetRolesForWorkers(): Observable<Roles>
  {
    return this.http.get<Roles>(this.baseUrl + 'api/Role/for_field_work');
  }
  UploadAvatar(userId: string, file: File): Observable<HttpEvent<User>>
  {
    const formData: FormData = new FormData();

    formData.append('Logo', file);

    const req = new HttpRequest('POST', this.baseUrl + 'api/Users/upload_avatar/'+userId, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<User>(req);
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
  // Clear Cache
  clearCache() {
    this.user$ = null!;
  }
}
