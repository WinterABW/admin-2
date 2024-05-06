import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { TemporadaService } from 'src/app/services/temporada.service';

@Injectable({
  providedIn: 'root'
})
export class TemporadaResolverService implements Resolve<any> {

  constructor(
    private temporadaService: TemporadaService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.temporadaService.get(route.paramMap.get('id'));
  }
}
