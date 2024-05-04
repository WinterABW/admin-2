import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PlanStore, PlanState } from './plan.store';

@Injectable({ providedIn: 'root' })
export class PlanQuery extends QueryEntity<PlanState> {

  constructor(protected override store: PlanStore) {
    super(store);
  }

}
