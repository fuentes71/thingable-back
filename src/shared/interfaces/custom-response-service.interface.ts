export interface ICustomResponseService<T> {
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  data: T;
}
