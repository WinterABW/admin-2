export interface Response<T> {
  count: number;
  next: number;
  previous: number;
  results: T[];
}
