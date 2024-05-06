import { Injectable } from '@angular/core';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { PlanStore, PlanState } from './plan.store';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PlanService extends NgEntityService<PlanState> {
  constructor(protected override store: PlanStore) {
    super(store);
  }
  override baseUrl=environment.baseUrl
}
