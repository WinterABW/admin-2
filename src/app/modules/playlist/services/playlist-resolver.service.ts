import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PlaylistService} from './playlist.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistResolverService implements Resolve<any []> {

  constructor(
    private service: PlaylistService
  ) {
  }

  resolve(): Observable<any[]> | Promise<any[]> | any[] {
    return this.service.getAll({page: 1, page_size: 10});
  }
}
