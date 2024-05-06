import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { SerieService } from 'src/app/services/serie.service';

@Injectable({
  providedIn: 'root'
})
export class SerieResolverService implements Resolve<any> {

  constructor(
    private serieService: SerieService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.serieService.get(route.paramMap.get('id'));
  }
}
