import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {NotificationState, NotificationStore} from './notification.store';

@Injectable({providedIn: 'root'})
export class NotificationQuery extends QueryEntity<NotificationState> {

  constructor(protected override store: NotificationStore) {
    super(store);
  }

}
