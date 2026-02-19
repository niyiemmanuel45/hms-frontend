import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppSettings } from '../models/app-settings';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  Encrpyt(model: string) {
    return this.http.get(this.baseUrl + 'api/Settings/encrypt?encrypted_value='+ model);
  }
  Decrpyt(model: string) {
    return this.http.get(this.baseUrl + 'api/Settings/decrypt?decrypted_value='+ model);
  }

  GetAppSettingByName(name: string): Observable<AppSettings> {
    return this.http.get<AppSettings>(`${this.baseUrl}api/Settings/get_settings_by_name/`+ name);
  }
  GetAppSettings(): Observable<AppSettings[]>
  {
    return this.http.get<AppSettings[]>(this.baseUrl + 'api/Settings');
  }

  AddAppSettings(model: any) {
    return this.http.post(this.baseUrl + `api/Settings/create`, model, { responseType: "json" });
  }

  UpdateAppSettings(name: string, edit: any) {
    return this.http.put(this.baseUrl + 'api/Settings/update/'+ name, edit, { responseType: "json" });
  }

  DeleteAppSettings(id: number) {
    return this.http.delete(this.baseUrl + 'api/Settings/'+ id);
  }
}
