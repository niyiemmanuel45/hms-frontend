import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { OrganizationSetting, Setting } from '../models/organization-setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetSettingById(Id: number): Observable<OrganizationSetting> {
    return this.http.get<OrganizationSetting>(`${this.baseUrl}api/TenantSettings/`+ Id);
  }
  GetSettings(id:number): Observable<Setting>
  {
    return this.http.get<Setting>(`${this.baseUrl}api/TenantSettings/tenant_settings/${id}`);
  }

  AddSettings(orgCode: string, model: any) {
    return this.http.post(this.baseUrl + `api/TenantSettings/create?orgCode=${orgCode}`, model, { responseType: "json" });
  }

  UpdateSettings(id: number, edit: any) {
    return this.http.put(this.baseUrl + 'api/TenantSettings/update/'+ id, edit, { responseType: "json" });
  }

  CheckIfASettingisProfiled(orgId: number, condtion: string) {
    return this.http.get(this.baseUrl + `api/TenantSettings/check_if_profiled/${orgId}?condition=${condtion}`)
    .pipe(catchError(this.handleError));
  }

  DeleteSettings(id: number) {
    return this.http.delete(this.baseUrl + 'api/TenantSettings/'+ id);
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
