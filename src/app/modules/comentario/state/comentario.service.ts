import {Injectable} from '@angular/core';
import {NgEntityService} from '@datorama/akita-ng-entity-service';
import {ComentarioState, ComentarioStore} from './comentario.store';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ComentarioService extends NgEntityService<ComentarioState> {

  constructor(protected override store: ComentarioStore) {
    super(store);
  }
  override baseUrl=environment.baseUrl
}
