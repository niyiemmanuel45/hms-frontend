import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardDto, PaymentResult, Transaction } from '../models/transaction';
import { DashBoardResult, PaginatedResult, Pagination, SingleResult } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class RemitaService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  MakePayment(billId: number): Observable<SingleResult<PaymentResult>> {
    return this.http.post<SingleResult<PaymentResult>>(`${this.baseUrl}api/Payment/make-payment/${billId}`, {});
  }

  ConfirmPayment(transRef: string) {
    return this.http.post(`${this.baseUrl}api/Payment/update-status/${transRef}`, {});
  }

  TerminateTransaction(transRef: string) {
    return this.http.post(`${this.baseUrl}api/Payment/terminate/${transRef}`, {});
  }

  PrintReceipt(id: number): Observable<SingleResult<string>> {
    return this.http.get<SingleResult<string>>(`${this.baseUrl}api/Payment/print-receipt/${id}`);
  }

  Dashboard(): Observable<DashBoardResult<DashboardDto>> {
    return this.http.get<DashBoardResult<DashboardDto>>(`${this.baseUrl}api/Payment/counter`);
  }

  GetAll(pagination: Pagination, filters: any): Observable<PaginatedResult<Transaction>>
  {
    let params = new HttpParams()
      .set('pageNumber', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

      // Add filter parameters dynamically
      for (const key in filters) {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      }
    return this.http.get<PaginatedResult<Transaction>>(`${this.baseUrl}api/Payment/all-transactions`, { params })
    .pipe(catchError(this.handleError));
  }

  DashboardTrazact(pagination: Pagination, filters: any): Observable<PaginatedResult<Transaction>>
  {
    let params = new HttpParams()
      .set('pageNumber', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

      // Add filter parameters dynamically
      for (const key in filters) {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      }
    return this.http.get<PaginatedResult<Transaction>>(`${this.baseUrl}api/Payment/paid-transactions`, { params })
    .pipe(catchError(this.handleError));
  }

  PatientPayments(id: string, pagination: Pagination, filters: any): Observable<PaginatedResult<Transaction>>
  {
    let params = new HttpParams()
      .set('pageNumber', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

      // Add filter parameters dynamically
      for (const key in filters) {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      }
    return this.http.get<PaginatedResult<Transaction>>(`${this.baseUrl}api/Payment/patient-transactions/${id}`, { params })
    .pipe(catchError(this.handleError));
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
