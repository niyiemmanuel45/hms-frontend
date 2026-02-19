export class Pagination {
  page: number;
  count: number;
  pageSize: number;
  pageSizes: number[];

  constructor(page?: number, count?: number, pageSize?: number, items?: number[]){
      this.page = page!;
      this.count = count!;
      this.pageSize = pageSize!;
      this.pageSizes = items!;
  }
}

export class ResponseData<T> {
  pageSize:   number;
  pageNumber: number;
  totalSize:  number;
  items:      T[];

  constructor(totalSize?: number, page?: number, pageSize?: number, items?: T[]){
      this.pageNumber = page!;
      this.totalSize = totalSize!;
      this.pageSize = pageSize!;
      this.items = items!;
  }
}
export class PaginatedResult<T> {
requestSuccessful: boolean;
responseData:      ResponseData<T>;
message:           string;
responseCode:      string;
}

//for audit question page
export class QueResponseData<T> {
pageSize:   number;
pageNumber: number;
totalSize:  number;
items:      T;
}
export class QuestionPaginatedResult<T> {
requestSuccessful: boolean;
responseData:      QueResponseData<T>;
message:           string;
responseCode:      string;
}
export class SingleResult<T> {
requestSuccessful: boolean;
responseData:      T;
message:           string;
responseCode:      string;
}

export class DashBoardResult<T> {
  requestSuccessful: boolean;
  payload:      T;
  message:           string;
  responseCode:      string;
  }
