import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { pluck } from 'rxjs/operators';
import { UtilesService } from './utiles.service';

const baseUrlv1 = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const apiURLv2 = `${baseUrlv2}/usuario`;
const apiURLv1 = `${baseUrlv1}/usuario`;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  baseUrl: string = 'https://api.picta.cu/v2/usuario/';

  constructor(private httpClient: HttpClient,
    private utilesService: UtilesService) {
  }

  getAll(params) {
    const queryParams = this.utilesService.getQueryParams(params);
    return this.httpClient.get(`${apiURLv2}/`, {
      params: queryParams
    });
  }

  getAllUsers(params?) {
    let queryParameters = new HttpParams();
    if (params) {
      queryParameters = this.utilesService.getQueryParams(params);
    }

    return this.httpClient.get(`${baseUrlv2}/usuario/?asociar_canal=true&page_size=25&is_active=true`, {
      params: queryParameters
    }).pipe(pluck('results'));
  }


  get_usuarios(event?: any) {
    if (event) {
      return this.httpClient.get(
        this.baseUrl +
        `?page=${event.pageIndex + 1}&page_size=${event.pageSize}`
      );
    } else {
      return this.httpClient.get(this.baseUrl + `?page=1&page_size=10`);
    }
  }

  delete(id: number) {
    return this.httpClient.delete(`${apiURLv1}/${id}`);
  }

  getUser(id: string) {
    return this.httpClient.get(`${apiURLv2}/?id=${id}`).pipe(pluck('results'));
  }

  updateUser(id, user) {
    const body = new FormData();
    for (const field in user) {
      body.append(field, Array.isArray(user[field]) ? user[field].join(',') : user[field]);
    }
    if (user.phone_number) {
      body.append('country_code', '+53');

    }
    return this.httpClient.patch(`${apiURLv1}/${id}/`, body);

  }

  changePassword(data: { id: number, new_password: string }) {
    const body = new FormData();
    body.append('id', data.id.toString());
    body.append('new_password', data.new_password);
    return this.httpClient.put(`${apiURLv1}/set_password_without_old/`, body);
  }

  create(body: any) {
    const fd = this.utilesService.getBody(body);
    return this.httpClient.post(`${apiURLv1}/`, fd);
  }
}
