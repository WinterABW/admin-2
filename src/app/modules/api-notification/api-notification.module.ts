import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiNotificationRoutingModule } from './api-notification-routing.module';
import { ApiNotificationsComponent } from './components/api-notifications/api-notifications.component';
import { ApiNotificationCreateComponent } from './components/api-notification-create/api-notification-create.component';
import { ApiNotificationEditComponent } from './components/api-notification-edit/api-notification-edit.component';
import { ApiNotificationFormComponent } from './components/api-notification-form/api-notification-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [
    ApiNotificationsComponent,
    ApiNotificationCreateComponent,
    ApiNotificationEditComponent,
    ApiNotificationFormComponent
  ],
  imports: [
    CommonModule,
    ApiNotificationRoutingModule,
    CommonComponentsModule,
    DemoMaterialModule,
    ReactiveFormsModule
  ]
})
export class ApiNotificationModule {
}
