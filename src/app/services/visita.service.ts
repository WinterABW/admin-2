import { Injectable } from '@angular/core';
import { NgEntityService, NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { VoteStore, VoteState } from '../modules/visita/state/vote.store';
import { environment } from 'src/environments/environment';
@NgEntityServiceConfig({
  resourceName: 'voto',
})
@Injectable({ providedIn: 'root' })
export class VisitaService extends NgEntityService<VoteState> {

  constructor(protected override store: VoteStore) {
    super(store);
  }
  override baseUrl = environment.baseUrl
}
