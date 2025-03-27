export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any>;

  constructor(
    success: boolean,
    message: string,
    data: T,
    meta?: Record<string, any>,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}
