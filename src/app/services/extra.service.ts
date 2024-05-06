import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { UtilesService } from './utiles.service';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = `${baseUrl}/extra/`;
const URLv2 = `${baseUrlv2}/extra/`;

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  constructor(private httpClient: HttpClient,
    private utilesService: UtilesService) {
  }

  getByType(type: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('tipo', type);
    return this.httpClient.get(URLv2, { params: queryParams }).pipe(pluck('results'));

  }

  create(extra: { tipo: string, nombre: string }) {
    const body = new FormData();
    body.append('tipo', extra.tipo);

    body.append('nombre', extra.nombre);
    return this.httpClient.post(URL, body);
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
}
