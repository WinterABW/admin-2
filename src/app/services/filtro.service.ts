import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UtilesService } from './utiles.service';

const baseUrl = environment.baseUrl

const url = `${baseUrl}/filtro_query/`;

@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor(private httpClient: HttpClient, private utilesService: UtilesService) {
  }


  getAll(params?) {
    let queryParams;
    if (params) {
      queryParams = this.utilesService.getQueryParams(params);
    }
    return this.httpClient.get(url, { params: queryParams });

  }

  addFiltro(data) {
    let body = new FormData();
    body.append('key', data.key);
    body.append('value', data.value);
    return this.httpClient.post(url, body);
  }

  deleteFilter(id: number) {
    return this.httpClient.delete(`${url}${id}/`);
  }

  editSection(id: number, dirtyValues: {}) {
    const body = new FormData();
    for (let field in dirtyValues) {
      body.append(field, dirtyValues[field]);
    }
    return this.httpClient.patch(`${url}${id}/`, body);


  }
}
