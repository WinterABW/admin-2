import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from '../../../services/utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
const baseUrlv2 = environment.baseUrlv2;

const URL = `${baseUrl}/comentario`;
const URLv2 = `${baseUrlv2}/comentario/`;

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private httpClient: HttpClient, private utils: UtilesService) {}

  get_comentarios(params) {
    let queryParams;
    if (params) {
      queryParams = this.utils.getQueryParams(params);
    }

    return this.httpClient.get(`${URLv2}`, {
      params: queryParams,
    });
  }

  delete(id: any) {
    return this.httpClient.delete(`${URL}/${id}/`);
  }

  togglePublicado(id: number, status: boolean) {
    const body = new FormData();
    body.append('publicado', status.toString());
    return this.httpClient.patch(`${URL}/${id}/`, body);
  }

  addRespuesta(comment) {
    const respuesta = this.utils.getBody(comment);
    return this.httpClient.post(`${URL}/`, respuesta);
  }
}
