import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EventService} from './event.service';
import {Observable} from 'rxjs';
import {pluck, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventResolverService implements Resolve<any> {

  constructor(
    private eventService: EventService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.eventService.getAll({id: route.paramMap.get('id')})
      .pipe(
        pluck('results'),
        take(1)
      );
  }
}
