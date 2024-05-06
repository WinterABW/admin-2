import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { PalabrasClavesService } from 'src/app/services/palabras-claves.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordsResolverService implements Resolve<any> {

  constructor(
    private palabrasClavesService: PalabrasClavesService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.palabrasClavesService.getByQuery({});
  }
}
