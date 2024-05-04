import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, pluck } from 'rxjs/operators';
import { UtilesService } from './utiles.service';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Logs } from '../models/logs';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = `${baseUrl}/registro_accion/`;
const URLv2 = `${baseUrlv2}/registro_accion`;

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  baseUrl = 'https://api.picta.cu/v2/registro_accion/';

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }

  getA(params?): Observable<Logs[]> {
    const queryParams = this.utils.getQueryParams(params);
    return this.httpClient.get<any>(URLv2, {
      params: queryParams
    }).pipe(pluck('results'));
  }


  getAll(params) {
    const queryParams = this.utils.getQueryParams(params);
    return this.httpClient.get(`${URLv2}/`, {
      params: queryParams
    });
  }

  getByParams(event?: any) {
    if (event) {
      return this.httpClient.get(
        this.baseUrl +
        `?page=${event.pageIndex + 1}&page_size=${event.pageSize}`
      );
    } else {
      return this.httpClient.get(this.baseUrl + `?page=1&page_size=10`);
    }
  }

  create(canal: any) {
    const body = new FormData();
    body.append('nombre', canal.nombre);
    body.append('descripcion', canal.descripcion);
    body.append('alias', canal.alias);
    body.append('url_imagen', canal.url_imagen);
    body.append('propietario', canal.propietario);
    body.append('seller', canal.seller);
    body.append('url_avatar', canal.url_avatar);
    body.append('palabraClave', canal.palabras_claves.toString());
    body.append('usuarios_asociados', canal.usuarios.toString());
    canal.planes.length && body.append('planes', canal.planes.toString());
    body.append('publicado', canal.publicado);
    return this.httpClient.post(URL, body);
  }

  update(id, canal: any) {
    const body = new FormData();
    for (const field in canal) {
      body.append(field, Array.isArray(canal[field]) ? canal[field].map(i => i.id ? i.id : i) : canal[field]);
    }
    return this.httpClient.patch(`${URL}${id}/`, body);
  }

  get(slugUrl: any) {
    return this.httpClient.get<any>(`${URLv2}/`, {
      params: new HttpParams().set('slug_url', slugUrl)
    }).pipe(
      map((response: any) => response.results ? response.results[0] : null)
    );
  }

  delete(id: number) {
    return this.httpClient.delete(`${URL}${id}`);
  }

  setStatus(id: any, publicado: any) {
    const body = new FormData();
    body.append('publicado', publicado);
    return this.httpClient.patch(`${baseUrl}/canal/${id}/`, body);
  }
}
