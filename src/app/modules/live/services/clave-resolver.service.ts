import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { PublicationService } from 'src/app/services/publication.service';

@Injectable({
  providedIn: 'root'
})
export class ClaveResolverService implements Resolve<any> {

  constructor(
    private publicationService: PublicationService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.publicationService.generarClave();
  }
}
