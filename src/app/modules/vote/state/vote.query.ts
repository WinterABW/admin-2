import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { VoteStore, VoteState } from './vote.store';

@Injectable({ providedIn: 'root' })
export class VoteQuery extends QueryEntity<VoteState> {

  constructor(protected override store: VoteStore) {
    super(store);
  }

}
