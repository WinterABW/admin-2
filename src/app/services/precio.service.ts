import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import { environment } from 'src/environments/environment';

const baseUrl=environment.baseUrl

const URL = `${baseUrl}/precio/`

@Injectable({
  providedIn: 'root'
})
export class PrecioService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getAll() {
    return this.httpClient.get(URL).pipe(map((res: any) => res.results));
    ;
  }
}

