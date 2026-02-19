import { Injectable } from '@angular/core';
import { Page } from 'ngx-pagination';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }
  private pageSource: Subject<Page> = new Subject<Page>();
    public pageSource$: Observable<Page> = this.pageSource.asObservable();


    private setPageFromQueryParameters: Subject<number> = new Subject<number>();
    public setPageFromQueryParameters$: Observable<number> = this.setPageFromQueryParameters.asObservable();


    public initialize: Subject<void> = new Subject<void>();
    public initialize$: Observable<void> = this.initialize.asObservable();


    public pageChanged(page: Page): void {
        this.pageSource.next(page);
    }

    public setFromQueryParameters(pageIndex: number): void {
        this.setPageFromQueryParameters.next(pageIndex);
    }

    public init(): void {
        this.initialize.next();
    }
}
