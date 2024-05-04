import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UtilesService } from './utiles.service';

const baseUrlv2=environment.baseUrlv2

const URL = `${baseUrlv2}`;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilesService
  ) {
  }

  getResumenDatos(params = {}) {
    let queryParams;
    if (params) {
      queryParams = this.utilsService.getQueryParams(params);
    }

    return this.httpClient.get(`${URL}/resumen/datos/`, {
      params: queryParams
    });
  }
}
