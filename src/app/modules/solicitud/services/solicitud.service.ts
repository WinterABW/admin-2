import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilesService } from '../../../services/utiles.service';
import { Observable } from 'rxjs';
import { PictaResponse } from '../../../models/response.picta.model';
import { Solicitud } from '../model/solicitud';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const URL = baseUrl + '/solicitud';
const URLv2 = baseUrlv2 + '/solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(
    private http: HttpClient,
    private utilesService: UtilesService,
  ) {
  }

  getAll(params = {}): Observable<PictaResponse<Solicitud>> {
    const qParams = this.utilesService.getQueryParams(params);
    return this.http.get<PictaResponse<Solicitud>>(URLv2, {
      params: qParams
    });
  }

  create(data) {
    return this.http.post(`${URL}/`, data);
  }

  delete(id) {
    return this.http.delete(`${URL}/${id}`);
  }
  update(data) {
    return this.http.patch(`${URL}/${data.id}/`, data);
  }
}
