import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GrupoService } from 'src/app/services/grupo.service';


@Injectable({
  providedIn: 'root'
})
export class GruposResolverService implements Resolve<any> {

  constructor(
    private service: GrupoService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.getAll();
  }
}
