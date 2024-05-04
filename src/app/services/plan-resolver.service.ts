import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Plan } from '../models/plan.model';
import { PlanService } from './plan.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const baseUrlv2=environment.baseUrlv2

@Injectable({
  providedIn: 'root'
})
export class PlanResolverService implements Resolve<Plan> {

  constructor(
    private planService: PlanService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Plan> | Promise<Plan> | Plan {
    const id = route.paramMap.get('id');
    return this.planService.get({
      url: baseUrlv2 + '/plan/',
      params: {
        id
      },
      skipWrite: true,
      mapResponseFn: (response) => response.results
    });
  }
}
