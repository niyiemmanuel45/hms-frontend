import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult } from '../models/pagination';
import { LabReport, LabReportDto, TestType, TestTypeDto } from '../models/test-type';

@Injectable({
  providedIn: 'root'
})
export class TestTypeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<TestType> {
    return this.http.get<TestType>(`${this.baseUrl}api/TestType/`+ Id);
  }

  GetAll(pagination: Pagination): Observable<PaginatedResult<TestType>>
  {
    return this.http.get<PaginatedResult<TestType>>(`${this.baseUrl}api/TestType?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetWithoutPage(): Observable<PaginatedResult<TestType>>
  {
    return this.http.get<PaginatedResult<TestType>>(`${this.baseUrl}api/TestType`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: TestTypeDto) {
    return this.http.post(this.baseUrl + 'api/TestType/create', model);
  }

  Update(id: number, edit: TestTypeDto) {
    return this.http.put(this.baseUrl + 'api/TestType/'+ id, edit);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/TestType/'+ id);
  }

  LabReportById(Id: number): Observable<LabReport> {
    return this.http.get<LabReport>(`${this.baseUrl}api/LabReports/`+ Id);
  }

  LabReportForPatient(id: string, pagination: Pagination): Observable<PaginatedResult<LabReport>>
  {
    return this.http.get<PaginatedResult<LabReport>>(`${this.baseUrl}api/LabReports/patient-lab-reports/${id}?pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }
 
  LabReportInsert(model: LabReportDto) {
    return this.http.post(this.baseUrl + 'api/LabReports/create', model);
  }

  LabReportUpdate(id: number, edit: LabReportDto) {
    return this.http.put(this.baseUrl + 'api/LabReports/'+ id, edit);
  }

  LabReportDelete(id: number) {
    return this.http.delete(this.baseUrl + 'api/LabReports/'+ id);
  }

  UploadLabResult(id: number, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('Logo', file);

    const req = new HttpRequest('POST', this.baseUrl + 'api/LabReports/attach-test-result/'+id, formData, {
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
}
