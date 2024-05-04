import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const urlSearchPublication = `${baseUrlv2}/publicacion/`;
const urlSearchCanal = `${baseUrlv2}/canal/`;
const urlSearchUsuario = `${baseUrlv2}/usuario/`;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) {
  }

  searchPublication(criterio: string, page?: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', page ? page : '1');
    queryParams = queryParams.set('page_size', '10');
    if (criterio) {
      queryParams = queryParams.set('nombre__wildcard', criterio + '*');
    }
    return this.httpClient.get(urlSearchPublication, { params: queryParams });

  }

  searchCanal(criterio: string, page?: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', page ? page : '1');
    queryParams = queryParams.set('page_size', '10');
    if (criterio) {
      queryParams = queryParams.set('nombre__wildcard', criterio + '*');
    }
    return this.httpClient.get(urlSearchCanal, { params: queryParams });

  }

  searchUsuario(criterio: string, page?: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', page ? page : '1');
    queryParams = queryParams.set('page_size', '10');
    if (criterio) {
      queryParams = queryParams.set('username__wildcard', '*' + criterio + '*');
      // queryParams = queryParams.set('phone_number__wildcard', criterio + '*');
    }
    return this.httpClient.get(urlSearchUsuario, { params: queryParams });

  }
}
