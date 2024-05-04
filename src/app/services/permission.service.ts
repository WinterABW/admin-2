import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from './utiles.service';
import { PictaResponse } from '../models/response.picta.model';
import { Permission } from '../models/permission';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const URL = `${baseUrl}/permiso/`;

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private httpClient: HttpClient,
    private utilService: UtilesService
  ) {
  }

  getAll(params = {}) {
    const qParams = this.utilService.getQueryParams(params);
    return this.httpClient.get<PictaResponse<Permission>>(`${URL}`, {
      params: qParams
    });
  }
}
