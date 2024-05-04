import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { UtilesService } from '../../../services/utiles.service';
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl
const baseUrlv2=environment.baseUrlv2

const urlV2 = `${baseUrlv2}/lista_reproduccion/`;
const url = `${baseUrl}/lista_reproduccion/`;

@Injectable({
  providedIn: 'root'
})
export class UserPlaylistService {
  onPlaylistChanged = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private utilesService: UtilesService
  ) {
  }

  getAll(params = {}) {
    const queryParams = this.getQueryParams(params);
    return this.httpClient.get(urlV2, { params: queryParams });
  }

  playlistChanged() {
    this.onPlaylistChanged.emit();
  }

  getQueryParams = (params) => {
    let queryParameters = new HttpParams();
    if (Object.keys(params).length > 0) {
      for (const param in params) {
        queryParameters = queryParameters.set(param, params[param]);
      }
      return queryParameters;
    }
    return null
  };

  create(val: any) {
    const body = this.utilesService.getBody(val);
    return this.httpClient.post(url, body);
  }

  delete(id: number) {
    return this.httpClient.delete(`${url}${id}`).pipe(
      finalize(() => {
        this.playlistChanged();
      })
    );
  }

  update(id, updateBody) {
    const body = this.utilesService.getBody(updateBody);
    return this.httpClient.patch(`${url}${id}`, body).pipe(
      finalize(() => {
        this.playlistChanged();
      })
    );
  }
}
