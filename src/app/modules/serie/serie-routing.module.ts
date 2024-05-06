import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SerieListComponent} from './serie-list/serie-list.component';
import {SerieAddComponent} from './serie-add/serie-add.component';
import {SerieEditComponent} from './serie-edit/serie-edit.component';
import { SerieResolverService } from '../resolvers/serie-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SerieListComponent
  },
  {
    path: 'add',
    component: SerieAddComponent
  },
  {
    path: 'edit/:id',
    component: SerieEditComponent,
    resolve: {
      serie: SerieResolverService
    }
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerieRoutingModule {
}
