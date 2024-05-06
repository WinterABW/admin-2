import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { PublicationService } from './publication.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationListResolverService implements Resolve<any> {

  constructor(private publicationService: PublicationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.publicationService.getAll({page_size: 10, page: 1});
  }
}
