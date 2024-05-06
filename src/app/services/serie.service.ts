import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2

const URL = `${baseUrl}/serie/`;
const URLv2 = `${baseUrlv2}/serie/`;

@Injectable({
  providedIn: 'root'
})
export class SerieService {

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }

  getAll() {
    return this.httpClient.get(`${URLv2}?page_size=100`).pipe(map((data: any) => data.results));
  }

  getByParams(params) {
    let queryParams;
    if (params) {
      queryParams = this.utils.getQueryParams(params);
    }
    return this.httpClient.get(URLv2, { params: queryParams });
  }

  get(id: any) {
    return this.httpClient.get(`${URLv2}${id}`);
  }

  create(serie: any) {
    const body = new FormData();
    for (const field in serie) {
      if (field) {
        body.append(field, Array.isArray(serie[field]) ? serie[field].map(i => i.id ? i.id : i) : serie[field]);
      }

    }
    return this.httpClient.post(URL, body);
  }

  delete(id: number) {
    return this.httpClient.delete(`${URL}${id}`);
  }

  /*   update(id, update: any) {
      let body = new FormData()
      for (let field in update) {
        body.append(field, Array.isArray(update[field]) ? update[field].map(i => i.id ? i.id : i) : update[field])
      }
      return this.httpClient.patch(`${URL}/${id}/`, body);
    } */

  update(id, serie: any) {
    const body = new FormData();
    for (const field in serie) {
      if (field) {
        body.append(field, Array.isArray(serie[field]) ? serie[field].map(i => i.id ? i.id : i) : serie[field]);
      }

    }
    return this.httpClient.patch(`${URL}${id}/`, body);
  }
}
