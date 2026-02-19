import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddCity, AddCountry, AddLga, AddRegion } from '../viewModel/add-country';
import { Country } from '../models/country';
import { PaginatedResult, Pagination } from '../models/pagination';
import { City, Lga } from '../models/city';
import { Region } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /* Country */
  getCountries() {
    return this.http.get<any>(`${this.baseUrl}api/StaticData/countries`).pipe(
      catchError(this.handleError)
    );
  }
  getCountryById(Id: string): Observable<Country> {
    return this.http.get<Country>(`${this.baseUrl}api/StaticData/country/`+ Id);
  }
  getCountry(pagination: Pagination): Observable<PaginatedResult<Country>>
  {
    return this.http.get<PaginatedResult<Country>>(`${this.baseUrl}api/StaticData/countries?pageSize=${pagination.pageSize}&page=${pagination.page}`)
      .pipe(catchError(this.handleError)
    );
  }

  saveCountry(model: AddCountry) {
    return this.http.post(this.baseUrl + 'api/StaticData/country/create', model);
  }

  updateCountry(id: string, edit: Country) {
    return this.http.put(this.baseUrl + 'api/StaticData/country/update/'+ id, edit);
  }

  deleteCountry(id: string) {
    return this.http.delete(this.baseUrl + 'api/StaticData/country/'+ id);
  }

  /* Region */
  getRegions(pagination?: Pagination): Observable<PaginatedResult<Region>>
  {
    return this.http.get<PaginatedResult<Region>>(`${this.baseUrl}api/StaticData/states`)
    .pipe(catchError(this.handleError));
  }

  getRegionById(Id: string): Observable<Region> {
    return this.http.get<Region>(`${this.baseUrl}api/StaticData/state/`+ Id);
  }
  saveRegion(model: AddRegion) {
    return this.http.post(this.baseUrl + 'api/StaticData/state/create', model);
  }
  updateRegion(id: string, edit: AddRegion) {
    return this.http.put(this.baseUrl + 'api/StaticData/state/update/'+ id, edit);
  }
  deleteRegion(id: string) {
    return this.http.delete(this.baseUrl + 'api/StaticData/state/'+ id);
  }

  getStates(countryId: string) {
    return this.http.get<any>(`${this.baseUrl}api/StaticData/get_state_by_country_id/${countryId}`).pipe(
      catchError(this.handleError)
    );
  }

  getCities(stateId: string) {
    return this.http.get<any>(`${this.baseUrl}api/StaticData/get_city_by_state_id/${stateId}`).pipe(
      catchError(this.handleError)
    );
  }
  CitiesByState(stateId: string, search: string, pagination: Pagination): Observable<PaginatedResult<City>> {
    return this.http.get<PaginatedResult<City>>(`${this.baseUrl}api/StaticData/get_city_by_state_id/${stateId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`).pipe(
      catchError(this.handleError)
    );
  }

  /* Region */
  getCity(regionId: string, search: string, pagination: Pagination): Observable<PaginatedResult<City>>
  {
    return this.http.get<PaginatedResult<City>>(`${this.baseUrl}api/StaticData/get_city_by_state_id/${regionId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  getCityById(Id: string): Observable<City> {
    return this.http.get<City>(`${this.baseUrl}api/StaticData/city/`+ Id);
  }
  saveCity(model: AddCity) {
    return this.http.post(this.baseUrl + 'api/StaticData/city/create', model);
  }
  updateCity(id: string, edit: AddCity) {
    return this.http.put(this.baseUrl + 'api/StaticData/city/update/'+ id, edit);
  }
  deleteCity(id: string) {
    return this.http.delete(this.baseUrl + 'api/StaticData/city/'+ id);
  }

  /* LGA */
  getLgas(cityId: string, search: string, pagination: Pagination): Observable<PaginatedResult<Lga>>
  {
    return this.http.get<PaginatedResult<Lga>>(`${this.baseUrl}api/StaticData/get_lga_by_city_id/${cityId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  getLgaByState(regionId: string, search: string, pagination: Pagination): Observable<PaginatedResult<Lga>>
  {
    return this.http.get<PaginatedResult<Lga>>(`${this.baseUrl}api/StaticData/get_lga_by_state_id/${regionId}?Name=${search}&pageSize=${pagination.pageSize}&page=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  GetLgasWithoutPage(cityId: string): Observable<PaginatedResult<Lga>>
  {
    return this.http.get<PaginatedResult<Lga>>(`${this.baseUrl}api/StaticData/get_lga_by_city_id/${cityId}`)
    .pipe(catchError(this.handleError));
  }

  GetLGA(pagination: Pagination): Observable<PaginatedResult<Lga>>
  {
    return this.http.get<PaginatedResult<Lga>>(`${this.baseUrl}api/StaticData/lga?pageSize=${pagination.pageSize}&page=${pagination.page}`)
    .pipe(catchError(this.handleError));
  }

  getLGAById(Id: number): Observable<Lga> {
    return this.http.get<Lga>(`${this.baseUrl}api/StaticData/lga/`+ Id);
  }

  saveLga(model: AddLga) {
    return this.http.post(this.baseUrl + 'api/StaticData/lga/create', model);
  }
  updateLga(id: number, edit: AddLga) {
    return this.http.put(this.baseUrl + 'api/StaticData/lga/update/'+ id, edit);
  }
  deleteLga(id: number) {
    return this.http.delete(this.baseUrl + 'api/StaticData/lga/'+ id);
  }

  UploadLogo(orgId: number, file: File): Observable<HttpEvent<any>>
  {
    const formData: FormData = new FormData();

    formData.append('Logo', file);

    const req = new HttpRequest('POST', this.baseUrl + 'api/StaticData/lga/upload/logo/'+orgId, formData, {
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
