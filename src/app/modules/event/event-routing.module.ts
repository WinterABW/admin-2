import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventComponent} from './components/event/event.component';
import {EventAddComponent} from './components/event-add/event-add.component';
import {EventEditComponent} from './components/event-edit/event-edit.component';
import {EventResolverService} from './services/event-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: EventComponent
  },
  {
    path: 'add',
    component: EventAddComponent
  },
  {
    path: 'edit/:id',
    component: EventEditComponent,
    resolve: {
      evento: EventResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {
}
