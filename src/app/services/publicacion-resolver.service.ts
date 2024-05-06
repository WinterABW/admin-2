import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { PublicationService } from './publication.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionResolverService implements Resolve<any> {

  constructor(
    private publicationService: PublicationService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.publicationService.loadPublication(route.paramMap.get('slug_url'));
  }
}
