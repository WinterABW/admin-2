import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Evento} from '../models/event';
import {Observable} from 'rxjs';
import {PictaResponse} from '../../../models/response.picta.model';
import {UtilesService} from '../../../services/utiles.service';
import {environment} from '../../../../environments/environment';

const baseUrlv2=environment.baseUrlv2
const baseUrl=environment.baseUrl

const URLEventUser = baseUrl + '/evento_usuario';
const URL = baseUrl + '/evento';
const URLv2 = baseUrlv2 + '/evento';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private httpClient: HttpClient,
    private utilesService: UtilesService,
  ) {
  }

  create(event: Evento) {
    return this.httpClient.post(URL + '/', event);
  }

  update(event: Evento) {
    return this.httpClient.patch(`${URL}/${event.id}/`, event);
  }

  getAll(params = {}): Observable<PictaResponse<any>> {
    return this.httpClient.get<PictaResponse<any>>(URLv2, {params: new HttpParams({fromObject: params})});
  }

  delete(id) {
    return this.httpClient.delete(`${URL}/${id}/`);
  }
}
