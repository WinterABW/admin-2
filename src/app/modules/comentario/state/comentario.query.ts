import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ComentarioState, ComentarioStore} from './comentario.store';

@Injectable({providedIn: 'root'})
export class ComentarioQuery extends QueryEntity<ComentarioState> {

  constructor(protected override store: ComentarioStore) {
    super(store);
  }

}
