import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilesService } from './utiles.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = baseUrl + '/seller/';
const URLv2 = baseUrlv2 + '/seller/';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(
    private httpClient: HttpClient,
    private utilService: UtilesService
  ) {
  }

  getAll(params = {}): Observable<any> {
    /*let qParams;
    if (params) {
      qParams = this.utilService.getQueryParams(params);
    }*/
    return this.httpClient.get(URLv2, {
      params: new HttpParams({ fromObject: params }),

    });
  }

  delete(id: number) {
    return this.httpClient.delete(`${URLv2}${id}/`);
  }

  update(data, id) {
    const body = this.utilService.getBody(data);
    return this.httpClient.patch(`${URLv2}${id}/`, body);
  }
}
