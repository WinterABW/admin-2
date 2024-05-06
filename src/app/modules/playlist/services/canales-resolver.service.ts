import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CanalService} from '../../../services/canal.service';

@Injectable({
  providedIn: 'root'
})
export class CanalesResolverService implements Resolve<any[]> {

  constructor(
    private canalService: CanalService
  ) {
  }

  resolve(): Observable<any[]> | Promise<any[]> | any[] {
    return this.canalService.getA({page_size: 100, ordering: 'nombre'});
  }
}
