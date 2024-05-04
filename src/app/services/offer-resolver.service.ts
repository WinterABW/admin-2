import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root'
})
export class OfferResolverService implements Resolve<any> {

  constructor(
    private offerService: OfferService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.offerService.getOne(route.paramMap.get('id'));
  }
}
