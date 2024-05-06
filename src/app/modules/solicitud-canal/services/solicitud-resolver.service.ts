import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudService } from '../../solicitud/services/solicitud.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudResolverService implements Resolve<any> {

  constructor(
    private solicitudService: SolicitudService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.solicitudService.getAll({ id: route.paramMap.get('id') }).pipe(
      map(response => response.results[0])
    );
  }
}
