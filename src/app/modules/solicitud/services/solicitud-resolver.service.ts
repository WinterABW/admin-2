import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Solicitud } from '../model/solicitud';
import { Observable } from 'rxjs';
import { SolicitudService } from './solicitud.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudResolverService implements Resolve<Solicitud> {

  constructor(
    private solicitudService: SolicitudService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Solicitud> | Promise<Solicitud> | Solicitud {
    return this.solicitudService.getAll({ id: route.paramMap.get('id') }).pipe(
      map(response => response.results[0])
    );
  }
}
