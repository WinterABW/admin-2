import {Injectable} from '@angular/core';
import {NgEntityService} from '@datorama/akita-ng-entity-service';
import {EventoState, EventoStore} from './evento.store';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class EventoService extends NgEntityService<EventoState> {

  constructor(protected override store: EventoStore) {
    super(store);
  }
   override baseUrl=environment.baseUrl
}
