import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Plan } from '../../../models/plan.model';

export interface PlanState extends EntityState<Plan> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'plan' })
export class PlanStore extends EntityStore<PlanState> {

  constructor() {
    super();
  }

}
