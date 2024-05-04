import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Vote } from './vote.model';

export interface VoteState extends EntityState<Vote> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'vote' })
export class VoteStore extends EntityStore<VoteState> {

  constructor() {
    super();
  }

}
