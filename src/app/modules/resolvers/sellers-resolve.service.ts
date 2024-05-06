import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { SellerService } from 'src/app/services/seller.service';

@Injectable({
  providedIn: 'root'
})
export class SellersResolveService implements Resolve<any> {

  constructor(
    private sellerService: SellerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.sellerService.getAll({active: true}).pipe(map(r => r.results));
  }
}
