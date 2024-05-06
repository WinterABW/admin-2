import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { format } from 'date-fns';

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2

const URL = `${baseUrl}/disco/`;
const URLv2 = `${baseUrlv2}/disco/`;

@Injectable({
  providedIn: 'root'
})
export class DiscoService {

  constructor(private httpClient: HttpClient) {
  }

  getAll() {
    return this.httpClient.get(URLv2).pipe(pluck('results'));
  }

  create(disco) {
    const body = new FormData();
    body.append('nombre', disco.nombre);
    body.append('canal', disco.canal);
    body.append('interprete', disco.interprete.map(i => i.id));
    body.append('casa_disquera', disco.casa_disquera.map(i => i.id));
    body.append('genero', disco.genero);
    body.append('imagen', disco.imagen);
    body.append('sello', disco.sello);
    body.append('release_date', format(disco.release_date, 'yyyy-MM-dd\'T\'HH:mm'));
    body.append('sale_start_date', format(disco.sale_start_date, 'yyyy-MM-dd\'T\'HH:mm'));
    return this.httpClient.post(URL, body);
  }
}
