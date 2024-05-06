import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilesService } from './utiles.service';

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2
const URL = `${baseUrlv2}/lista_reproduccion_canal/`;
const URLv1 = `${baseUrl}/lista_reproduccion_canal/`;
const URLv1LRCP = `${baseUrl}/li_re_ca_pub/`;
const URLv2LRCP = `${baseUrlv2}/li_re_ca_pub/`;

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(
    private httpClient: HttpClient,
    private utilesService: UtilesService
  ) {
  }

  getAll(params?) {
    let queryParams;
    if (params) {
      queryParams = this.utilesService.getQueryParams(params);
    }
    return this.httpClient.get<any[]>(`${URL}`, {
      params: queryParams
    });
  }

  delete(id: number) {
    return this.httpClient.delete(`${URLv1}${id}`);
  }

  deleteLRCP(id: number) {
    return this.httpClient.delete(`${URLv1LRCP}${id}`);
  }

  getLRCP(params: any): Observable<any[]> {
    const queryParams = this.utilesService.getQueryParams(params);
    return this.httpClient.get<any[]>(`${URLv2LRCP}`, { params: queryParams });
  }

  create(playlist: any) {
    const body = this.utilesService.getBody(playlist);
    return this.httpClient.post(URLv1, body);
  }

  createLRCP(playlist: any) {
    const body = this.utilesService.getBody(playlist);
    return this.httpClient.post(URLv1LRCP, body);
  }

  update(playlist: any) {
    const body = this.utilesService.getBody(playlist.list);
    if (playlist.selected.length) {
      body.append('list_pos_id', JSON.stringify(playlist.selected));
    }
    return this.httpClient.patch(`${URLv1}${playlist.list.id}/`, body);
  }
}
