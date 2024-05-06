import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';


const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2

const URL = `${baseUrl}/temporada/`;
const URLv2 = `${baseUrlv2}/temporada/`;

@Injectable({
  providedIn: 'root'
})
export class TemporadaService {

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }

  get(id: any) {
    return this.httpClient.get(`${URLv2}${id}`);
  }

  getAll() {
    return this.httpClient.get(URLv2).pipe(map((data: any) => data.results));
  }

  getBySerie(idSerie) {
    let query = new HttpParams();
    query = query.set('serie_pelser_id', idSerie);
    return this.httpClient.get(URLv2, { params: query }).pipe(map((data: any) => data.results));
  }

  create(temporada: any) {
    const body = new FormData();
    body.append('cantidad_capitulos', temporada.cant_cap);
    body.append('numero', temporada.numero);
    body.append('nombre', temporada.nombre);
    body.append('canal', temporada.canal);
    body.append('serie', temporada.serie);
    return this.httpClient.post(URL, body);
  }

  getByParams(params) {
    let queryParams;
    if (params) {
      queryParams = this.utils.getQueryParams(params);
    }
    return this.httpClient.get(URLv2, { params: queryParams });
  }

  delete(id: number) {
    return this.httpClient.delete(`${URL}${id}`);

  }

  update(id, temp: any) {
    const body = new FormData();
    for (const field in temp) {
      if (field) {
        body.append(field, Array.isArray(temp[field]) ? temp[field].map(i => i.id ? i.id : i) : temp[field]);
      }

    }
    return this.httpClient.patch(`${URL}${id}/`, body);
  }
}
