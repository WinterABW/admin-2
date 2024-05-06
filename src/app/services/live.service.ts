import {Injectable} from '@angular/core';
import {UtilesService} from './utiles.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment}from '../../environments/environment' 

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2
const urlV2 = `${baseUrlv2}/live/`;
const url = `${baseUrl}/live/`;

@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(
    private httpClient: HttpClient,
    private utilesService: UtilesService
  ) {
  }

  getAll(params = {}) {
    const queryParams = this.utilesService.getQueryParams(params);
    return this.httpClient.get(urlV2, {params: queryParams});
  }

  generarClave() {
    return this.httpClient.get(`${url}generar_clave`).pipe(
      map((res: any) => res.clave)
    );
  }

  create(val: any) {
    const body = this.utilesService.getBody(val);
    return this.httpClient.post(url, body);
  }

  delete(id: number) {
    return this.httpClient.delete(`${url}${id}`);
  }

  update(id, updateBody) {
    const body = this.utilesService.getBody(updateBody);
    return this.httpClient.patch(`${url}${id}/`, body);
  }
}
