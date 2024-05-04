import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = `${baseUrl}/genero/`;
const URLv2 = `${baseUrlv2}/genero/`;

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }

  getAll() {
    const queryParams = this.utils.getQueryParams({ ordering: 'nombre' });
    return this.httpClient.get(URLv2, { params: queryParams }).pipe(map((data: any) => data.results));

  }

  getList(params = {}) {
    const queryParams = this.utils.getQueryParams({ ...params, ordering: 'nombre' });
    return this.httpClient.get(URLv2, { params: queryParams });

  }


  getAllByTipo(tipo: string) {
    const queryParams = this.utils.getQueryParams({ tipo, ordering: 'nombre' });

    return this.httpClient.get(URLv2, { params: queryParams }).pipe(map((data: any) => data.results));
  }

  delete(id: any) {
    return this.httpClient.delete(`${URL}${id}`);
  }

  create(result: any) {
    const body = this.utils.getBody(result);
    return this.httpClient.post(URL, body);
  }

  update(result: any) {
    const body = this.utils.getBody(result);
    return this.httpClient.patch(`${URL}${result.id}/`, body);
  }
}
