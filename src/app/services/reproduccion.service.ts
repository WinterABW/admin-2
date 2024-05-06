import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from './utiles.service';
import { environment } from 'src/environments/environment';


const baseUrlv2 = environment.baseUrlv2

const URLv2 = `${baseUrlv2}/reproduccion/`;

@Injectable({
  providedIn: 'root'
})
export class ReproduccionService {

  constructor(private httpClient: HttpClient, private utils: UtilesService) {
  }

  getAll(params = {}) {
    const queryParams = this.utils.getQueryParams(params);

    return this.httpClient.get(`${URLv2}`, {
      params: queryParams
    });
  }
}
