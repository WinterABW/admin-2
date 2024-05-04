import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Tipologia } from '../models/tipologia.model';
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl
const url = `${baseUrl}/tipologia/`;

@Injectable({
  providedIn: 'root'
})
export class TipologiaService {

  constructor(private httpClient: HttpClient) {
  }

  add(data: any) {
    let body = new FormData();
    body.append('nombre', data.nombre);
    body.append('modelo', data.modelo);
    return this.httpClient.post(url, body);

  }

  delete(id: number) {
    return this.httpClient.delete(`${url}${id}`);
  }

  getAll(): Observable<Tipologia[]> {
    return this.httpClient.get<any>(url).pipe(pluck('results'));
  }

  update(data: any) {
    let body = new FormData();
    body.append('nombre', data.nombre);
    body.append('modelo', data.modelo);
    return this.httpClient.patch(`${url}${data.id}/`, body);

  }
}
