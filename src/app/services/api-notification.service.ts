import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilesService } from './utiles.service';
import { Observable } from 'rxjs';
import { PictaResponse } from '../models/response.picta.model';
import { environment } from 'src/environments/environment';
import { ApiNotification } from '../models/api-notification';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = baseUrlv2 + '/notificacion_api';
const URLv2 = baseUrlv2 + '/notificacion';

@Injectable({
  providedIn: 'root'
})
export class ApiNotificationService {


  constructor(
    private httpClient: HttpClient,
    private utilesService: UtilesService,
  ) {
  }

  create(event: ApiNotification) {
    return this.httpClient.post(URL + '/', event);
  }

  getAll(params = {}): Observable<PictaResponse<any>> {
    return this.httpClient.get<PictaResponse<any>>(URLv2, { params: new HttpParams({ fromObject: params }) });
  }

  delete(id) {
    return this.httpClient.delete(`${URL}/${id}/`);
  }
}
