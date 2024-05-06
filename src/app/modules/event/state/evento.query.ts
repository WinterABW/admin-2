import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {EventoState, EventoStore} from './evento.store';

@Injectable({providedIn: 'root'})
export class EventoQuery extends QueryEntity<EventoState> {
  constructor(protected override store: EventoStore) {
    super(store);
  }

}
