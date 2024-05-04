import { Injectable } from '@angular/core';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { environment } from 'src/environments/environment';
import { PlanState, PlanStore } from '../modules/plan/state/plan.store';

@Injectable({ providedIn: 'root' })
export class PlanService extends NgEntityService<PlanState> {

  constructor(protected override store: PlanStore) {
    super(store);
  }
  override baseUrl=environment.baseUrl
}
