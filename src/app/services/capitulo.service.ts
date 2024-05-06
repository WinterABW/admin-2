import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from './utiles.service';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = `${baseUrl}/capitulo/`;
const URLv2 = `${baseUrlv2}/capitulo/`;

@Injectable({
  providedIn: 'root'
})
export class CapituloService {

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }


  getAll() {
    return this.httpClient.get(URLv2).pipe(pluck('results'));
  }

  create(capitulo: any) {
    const body = new FormData();
    body.append('numero', capitulo.numero);
    body.append('tipologia', capitulo.tipologia);
    body.append('temporada', capitulo.temporada);

    return this.httpClient.post(URL, body);
  }

  getByParams(params) {
    let queryParams;
    if (params) {
      queryParams = this.utils.getQueryParams(params);
    }
    return this.httpClient.get(URL, { params: queryParams });
  }

  delete(id: number) {
    return this.httpClient.delete(`${URL}${id}`);

  }
}
