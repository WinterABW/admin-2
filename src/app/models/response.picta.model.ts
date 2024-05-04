export interface PictaResponse<T> {
  'count': number;
  next: any;
  previous: string;
  results: T[];
}
