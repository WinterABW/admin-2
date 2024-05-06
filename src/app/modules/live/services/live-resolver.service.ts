import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PictaResponse} from '../../../models/response.picta.model';
import {Publicacion} from '../../../models/publicacion';
import { PublicationService } from 'src/app/services/publication.service';

@Injectable({
  providedIn: 'root'
})
export class LiveResolverService implements Resolve<any> {

  constructor(
    private publicationService: PublicationService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.publicationService.getAll({id: route.paramMap.get('id')}).pipe(
      map((resp: PictaResponse<Publicacion>) => resp.results[0])
    );
  }
}
