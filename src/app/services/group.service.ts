import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from './utiles.service';
import { PictaResponse } from '../models/response.picta.model';
import { Group } from '../models/group';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const URL = `${baseUrl}/grupo/`;

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private httpClient: HttpClient,
    private utilService: UtilesService
  ) {
  }

  getAll(params = {}) {
    const qParams = this.utilService.getQueryParams(params);
    return this.httpClient.get<PictaResponse<Group>>(`${URL}`, {
      params: qParams
    });
  }

  update({ id, permissions }) {
    const body = this.utilService.getBody({ permissions });
    return this.httpClient.patch(`${URL}${id}/`, body);
  }

  create(data) {
    const body = this.utilService.getBody(data);
    return this.httpClient.post(`${URL}`, body);

  }

  delete(id: number) {
    return this.httpClient.delete(`${URL}${id}/`);

  }
}
