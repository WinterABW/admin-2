import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Response } from "../models/response";

const baseUrl = environment.baseUrl

const URL = `${baseUrl}/estilo`;

@Injectable({
  providedIn: 'root'
})
export class EstiloService {

  constructor(
    private httCLient: HttpClient
  ) {
  }

  getAll() {
    return this.httCLient.get(`${URL}`).pipe(map((data: Response<any>) => data.results));
  }

}
