import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PictaResponse } from '../../../models/response.picta.model';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl
const baseUrlv2 = environment.baseUrlv2

const UrlProvince = baseUrlv2 + '/province';
const UrlMunicipality = baseUrlv2 + '/municipality';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getProvinces(params = {}): Observable<PictaResponse<any>> {
    return this.http.get<PictaResponse<any>>(UrlProvince, {
      params: new HttpParams({ fromObject: params })
    });
  }

  getMunicipalities(params = {}): Observable<PictaResponse<any>> {
    return this.http.get<PictaResponse<any>>(UrlMunicipality, {
      params: new HttpParams({ fromObject: params })
    });
  }
}
