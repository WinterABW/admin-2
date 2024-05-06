import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Comentario} from './comentario.model';

export interface ComentarioState extends EntityState<Comentario> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'comentario'})
export class ComentarioStore extends EntityStore<ComentarioState> {

  constructor() {
    super();
  }

}
