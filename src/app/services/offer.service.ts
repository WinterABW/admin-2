import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = `${baseUrl}/payment_item/`;
const URLv2 = `${baseUrlv2}/payment_item/`;

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(
    private httpClient: HttpClient,
    private utils: UtilesService
  ) {
  }

  create(data: any) {
    return this.httpClient.post(`${URLv2}`, data);
  }

  getByParams(params) {
    let queryParams;
    if (params) {
      queryParams = this.utils.getQueryParams(params);
    }
    return this.httpClient.get(`${URLv2}`, { params: queryParams });
  }

  delete(id: number) {
    return this.httpClient.delete(`${URLv2}${id}/`);

  }

  update(id, data: any) {
    return this.httpClient.patch(`${URLv2}${id}/`, data);
  }

  getOne(id: string) {
    return this.httpClient.get(`${URLv2}${id}/`);
  }
}
