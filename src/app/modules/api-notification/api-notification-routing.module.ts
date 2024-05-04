import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiNotificationsComponent } from './components/api-notifications/api-notifications.component';
import { ApiNotificationCreateComponent } from './components/api-notification-create/api-notification-create.component';

const routes: Routes = [
  { path: '', component: ApiNotificationsComponent },
  { path: 'create', component: ApiNotificationCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiNotificationRoutingModule {
}
