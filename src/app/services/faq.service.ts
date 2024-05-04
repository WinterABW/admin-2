import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { pluck } from "rxjs/operators";

const baseUrl = environment.baseUrl

const URL = `${baseUrl}/faq/`

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private httpClient: HttpClient) {
  }

  getAll() {
    return this.httpClient.get(URL).pipe(pluck('results'));
  }

  create(faq: any) {
    let body = new FormData();
    body.append('titulo', faq.titulo)
    body.append('texto', faq.texto)
    return this.httpClient.post(URL, body);
  }

  delete(id: any) {
    return this.httpClient.delete(`${URL}${id}/`);
  }

  get(id: any) {
    return this.httpClient.get(`${URL}${id}/`);
  }

  update(id, faq: any) {
    const body = new FormData();
    body.append('titulo', faq.titulo);
    body.append('texto', faq.texto);
    return this.httpClient.patch(`${URL}${id}/`, body);
  }
}
