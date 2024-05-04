import { Injectable } from '@angular/core';
import { NgEntityService, NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { NotificationState, NotificationStore } from '../modules/api-notification/state/notification.store';
import { environment } from 'src/environments/environment';


const baseUrlv2=environment.baseUrlv2

@NgEntityServiceConfig({
  resourceName: 'notificacion',
  baseUrl: baseUrlv2
})
@Injectable({ providedIn: 'root' })
export class NotificationService extends NgEntityService<NotificationState> {

  constructor(protected override store: NotificationStore) {
    super(store);
  }

}
