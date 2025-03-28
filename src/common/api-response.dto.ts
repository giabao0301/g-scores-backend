export class ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;

  constructor(success: boolean, status: number, message: string, data: T) {
    this.success = success;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export class PageResponse<T> {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  content: T[];

  constructor(
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalElements: number,
    content: T[],
  ) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalElements = totalElements;
    this.content = content;
  }
}
