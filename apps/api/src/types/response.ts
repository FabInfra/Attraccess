import { PaginationOptions } from './request';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export function makePaginatedResponse<T>(
  requestOptions: PaginationOptions,
  data: T[],
  total: number
): PaginatedResponse<T> {
  return {
    data,
    total,
    page: requestOptions.page,
    limit: requestOptions.limit,
  };
}
