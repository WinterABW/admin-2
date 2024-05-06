import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2

const URL = `${baseUrl}/persona/`;
const URLv2 = `${baseUrlv2}/persona/`;

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private httpClient: HttpClient,
    private utilesService: UtilesService) {
  }

  getAll() {
    return this.httpClient.get(`${URL}?page_size=10`).pipe(pluck('results'));

  }

  getAllFiltered(params?) {
    let queryParameters = new HttpParams();
    if (params) {
      queryParameters = this.utilesService.getQueryParams(params);
    }
    return this.httpClient.get(`${URLv2}`, { params: queryParameters });

  }

  getByQuery(params?) {
    let queryParameters = new HttpParams();
    if (params) {
      queryParameters = this.utilesService.getQueryParams(params);
    }

    return this.httpClient.get(`${URLv2}`, {
      params: queryParameters
    }).pipe(pluck('results'));
  }

  create(nombre: string) {
    const body = new FormData();
    body.append('nombre', nombre);
    return this.httpClient.post(URL, body);
  }

  delete(id) {
    return this.httpClient.delete(`${URL}${id}/`);
  }
}
