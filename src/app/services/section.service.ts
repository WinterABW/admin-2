import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, retryWhen, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const url = `${baseUrl}/seccion/`;
const urlV2 = `${baseUrlv2}/seccion/`;

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private httpClient: HttpClient) {
  }

  getSecciones(page: number) {
    const params = {
      'fecha_ini__lte': new Date().getTime(),
      'fecha_fin__gte': new Date().getTime(),
      'activo': true,
      'ordering': '-prioridad',
      'page_size': 5
    };

    let queryParameters = this.getQueryParams(params);
    if (page) {
      queryParameters = queryParameters.append('page', page.toString());
    }

    return this.httpClient.get(`${urlV2}`, {
      params: queryParameters
    }).pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(10000),
          take(500))
      )
    );
  }

  getSeccionesAdmin(params?) {
    let queryParams;
    if (params) {
      queryParams = this.getQueryParams(params);
    }
    return this.httpClient.get(`${urlV2}`, { params: queryParams });
  }

  getQueryParams = (params) => {
    let queryParameters = new HttpParams();
    if (Object.keys(params).length > 0) {
      for (const param in params) {
        queryParameters = queryParameters.set(param, params[param]);
      }
      return queryParameters;
    }
    return null
  };

  addSeccion(data) {
    let body = new FormData();
    body.append('nombre', data.nombre);
    body.append('estilo', data.estilo);
    body.append('fecha_ini', data.fecha_ini);
    body.append('fecha_fin', data.fecha_fin);
    body.append('prioridad', data.prioridad);
    body.append('filtros', data.filtros);
    return this.httpClient.post(url, body);

  }

  deleteSeccion(id: number) {
    return this.httpClient.delete(`${url}${id}/`);
  }

  editSection(id, dirtyValues) {
    const body = new FormData();
    for (let field in dirtyValues) {
      body.append(field, dirtyValues[field]);
    }

    return this.httpClient.patch(`${url}${id}/`, body);
  }
}
