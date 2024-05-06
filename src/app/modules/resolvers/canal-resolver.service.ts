import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { CanalService } from 'src/app/services/canal.service';

@Injectable({
  providedIn: 'root'
})
export class CanalResolverService implements Resolve<any> {

  constructor(
    private canalService: CanalService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.canalService.get(route.paramMap.get('slug_url'));
  }
}
