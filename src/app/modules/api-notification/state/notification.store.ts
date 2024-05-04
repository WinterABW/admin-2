import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Notification} from '../../../models/notification.model';

export interface NotificationState extends EntityState<Notification> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'notification'})
export class NotificationStore extends EntityStore<NotificationState> {

  constructor() {
    super();
  }

}
