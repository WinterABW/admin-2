import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Evento} from './evento.model';

export interface EventoState extends EntityState<Evento> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'evento'})
export class EventoStore extends EntityStore<EventoState> {

  constructor() {
    super();
  }

}
