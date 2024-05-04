import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";

import { SellerService } from "./seller.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Seller } from 'src/app/models/payment';

@Injectable({
  providedIn: 'root'
})
export class SellerResolveService implements Resolve<Seller> {

  constructor(
    private sellerService: SellerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Seller> | Promise<Seller> | Seller {
    return this.sellerService.getAll({ id: route.paramMap.get('id') }).pipe(map(r => r.results));

  }
}
