import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { AddStaffDto, Staff, UpdateStaffDto } from '../models/staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  baseUrl = environment.apiUrl;
  private user$: Observable<Staff[]>;

  constructor(private http: HttpClient) { }

  getStaffs(tenantId: number, search: string, pagination: Pagination): Observable<PaginatedResult<Staff>>
  {
    return this.http.get<PaginatedResult<Staff>>(`${this.baseUrl}api/Staffs/all-staffs/${tenantId}?employeeId=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  getDoctors(tenantId: number, search: string, pagination: Pagination): Observable<PaginatedResult<Staff>>
  {
    return this.http.get<PaginatedResult<Staff>>(`${this.baseUrl}api/Staffs/doctors/${tenantId}?employeeId=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  DoctorsWithoutPage(tenantId: number): Observable<PaginatedResult<Staff>>
  {
    return this.http.get<PaginatedResult<Staff>>(`${this.baseUrl}api/Staffs/doctors/${tenantId}`)
      .pipe(catchError(this.handleError));
  }

  getNurses(tenantId: number, search: string, pagination: Pagination): Observable<PaginatedResult<Staff>>
  {
    return this.http.get<PaginatedResult<Staff>>(`${this.baseUrl}api/Staffs/nurses/${tenantId}?employeeId=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
      .pipe(catchError(this.handleError));
  }

  getStaffById(Id: string): Observable<Staff> {
    return this.http.get<Staff>(this.baseUrl + 'api/Staffs/'+ Id);
  }

  deleteStaff(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'api/Staffs/'+id);
  }

  Insert(model: AddStaffDto, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('Picture', file);
    formData.append('FirstName', model.firstName);
    formData.append('LastName', model.lastName);
    formData.append('StreetAddress', model.streetAddress);
    formData.append('UserName', model.userName);
    formData.append('NearestBusStop', model.nearestBusStop);
    formData.append('Email', model.email);
    formData.append('EmployeeId', model.employeeId);
    formData.append('Gender', model.gender);
    formData.append('HouseNumber', model.houseNumber);
    formData.append('PhoneNumber', model.phoneNumber);
    formData.append('StaffType', String(model.staffType));
    formData.append('DOB', model.dob);
    formData.append('CityId', model.cityId);
    formData.append('StateId', model.stateId);
    formData.append('HospitalId', String(model.hospitalId));
    formData.append('DepartmentId', String(model.departmentId));

    const req = new HttpRequest('POST', this.baseUrl + 'api/Staffs/create', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<any>(req);
  }

  Update(id: string, model: UpdateStaffDto, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('Picture', file);
    formData.append('FirstName', model.firstName);
    formData.append('LastName', model.lastName);
    formData.append('StreetAddress', model.streetAddress);
    formData.append('UserName', model.userName);
    formData.append('NearestBusStop', model.nearestBusStop);
    formData.append('Email', model.email);
    formData.append('EmployeeId', model.employeeId);
    formData.append('Gender', model.gender);
    formData.append('HouseNumber', model.houseNumber);
    formData.append('PhoneNumber', model.phoneNumber);
    formData.append('DOB', model.dob);
    formData.append('CityId', model.cityId);
    formData.append('StateId', model.stateId);
    formData.append('HospitalId', String(model.hospitalId));
    formData.append('DepartmentId', String(model.departmentId));

    const req = new HttpRequest('PUT', this.baseUrl + 'api/Staffs/'+id, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request<any>(req);
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
