import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl

const URL = `${baseUrl}/grupo`;

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private httpClient: HttpClient) {
  }

  getAll() {
    return this.httpClient.get(URL).pipe(pluck('results'));
  }

  delete(id: any) {
    return this.httpClient.delete(`${URL}/${id}/`);
  }

  get(id: any) {
    return this.httpClient.get(`${URL}/${id}/`);
  }

}
