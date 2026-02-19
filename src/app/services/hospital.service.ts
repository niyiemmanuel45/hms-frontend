import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, PaginatedResult, SingleResult } from '../models/pagination';
import { AddHospitalDto, Hospital, UpdateHospitalDto } from '../models/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetById(Id: number): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.baseUrl}api/Hospitals/`+ Id);
  }

  GetByCode(code: string): Observable<SingleResult<Hospital>> {
    return this.http.get<SingleResult<Hospital>>(`${this.baseUrl}api/Hospitals/code/`+ code);
  }

  GetAll(search: string, pagination: Pagination): Observable<PaginatedResult<Hospital>>
  {
    return this.http.get<PaginatedResult<Hospital>>(`${this.baseUrl}api/Hospitals?Name=${search}&pageSize=${pagination.pageSize}&pageNumber=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  Insert(model: AddHospitalDto, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('LogoURL', file);
    formData.append('Name', model.name);
    formData.append('Code', model.code);
    formData.append('Slogan', model.slogan);
    formData.append('Address', model.address);
    formData.append('LicenseNumber', model.licenseNumber);
    formData.append('ContactName', model.contactName);
    formData.append('EmailAddress', model.emailAddress);
    formData.append('RedirectURL', model.redirectURL);
    formData.append('WebsiteURL', model.websiteURL);
    formData.append('PhoneNumber', model.phoneNumber);
    formData.append('CityId', model.cityId);
    formData.append('StateId', model.stateId);
    formData.append('CountryId', model.countryId);

    const req = new HttpRequest('POST', this.baseUrl + 'api/Hospitals/create', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<any>(req);
  }

  Update(id: number, model: UpdateHospitalDto, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('LogoURL', file);
    formData.append('Name', model.name);
    formData.append('Code', model.code);
    formData.append('Slogan', model.slogan);
    formData.append('Address', model.address);
    formData.append('LicenseNumber', model.licenseNumber);
    formData.append('ContactName', model.contactName);
    formData.append('EmailAddress', model.emailAddress);
    formData.append('RedirectURL', model.redirectURL);
    formData.append('WebsiteURL', model.websiteURL);
    formData.append('PhoneNumber', model.phoneNumber);
    formData.append('CityId', model.cityId);
    formData.append('StateId', model.stateId);
    formData.append('CountryId', model.countryId);

    const req = new HttpRequest('PUT', this.baseUrl + 'api/Hospitals/'+id, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request<any>(req);
  }

  Delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/Hospitals/'+ id);
  }

  UploadLogo(orgId: number, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('Logo', file);

    const req = new HttpRequest('POST', this.baseUrl + 'api/Hospitals/add_logo/'+orgId, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<any>(req);
  }

  UploadSignature(orgId: number, file: File, key: string): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('formData', file);
    formData.append('key', key);

    const req = new HttpRequest('POST', this.baseUrl + `api/Hospitals/upload/signature/${orgId}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<any>(req);
  }

  SetSignature(id: number) {
    return this.http.post(this.baseUrl + `api/Hospitals/set_signature/${id}`, {});
  }

  SetInvoice(id: number) {
    return this.http.post(this.baseUrl + `api/Hospitals/set/letter/head/invoice/${id}`, {});
  }

  SetReceipt(id: number) {
    return this.http.post(this.baseUrl + `api/Hospitals/set/letter/head/receipt/${id}`, {});
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
