import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { UtilesService } from './utiles.service';


const URL = `https://api.picta.cu/v2/payment`;
const URL2 = `https://api.picta.cu/v2/seller`;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilesService
  ) {
  }

  getPayments(params = {}) {
    const qParams = this.utilsService.getQueryParams(params);
    return this.httpClient.get(`${URL}/payments/`, {params: qParams});
  }

  getSales(params = {}) {
    const qParams = this.utilsService.getQueryParams(params);
    return this.httpClient.get(`${URL}/sales/`, {params: qParams});
  }

  getReport(params = {}) {
    const qParams = this.utilsService.getQueryParams(params);
    return this.httpClient.get(`${URL}/report/`, {params: qParams});
  }

  getStats(params = {}) {
    const qParams = this.utilsService.getQueryParams(params);
    return this.httpClient.get(`${URL}/stats/`, {params: qParams});
  }

  exportExcel(params = {}) {
    return this.httpClient.get(`${URL}/export_excel_payments/`, {responseType: "blob", params: new HttpParams({fromObject: params})});
  }

  exportExcel_ventas(params = {}) {
    return this.httpClient.get(`${URL}/export_excel_report_ventas_payments/`, {responseType: "blob", params: new HttpParams({fromObject: params})});
  }

  exportExcel_vendedores(params = {}) {
    return this.httpClient.get(`${URL2}/export_excel_sellers/`, {responseType: "blob", params: new HttpParams({fromObject: params})});
  }
}
