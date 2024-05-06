import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from './utiles.service';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = `${baseUrl}/denuncia`;
const URLEstdoDenuncia = `${baseUrl}/estado_denuncia/`;
const URLv2 = `${baseUrlv2}/denuncia/`;

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  baseUrl = URLv2;

  constructor(private httpClient: HttpClient, private utils: UtilesService) {
  }

  getDenuncias(params) {
    const queryParams = this.utils.getQueryParams(params);
    return this.httpClient.get(this.baseUrl, { params: queryParams });
  }

  delete(id: number) {
    return this.httpClient.delete(`${URL}/${id}/`);
  }

  updateState(dto) {
    const body = this.utils.getBody(dto);
    return this.httpClient.post(`${URLEstdoDenuncia}`, body);
  }
}
