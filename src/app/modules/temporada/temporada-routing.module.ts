import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TemporadaListComponent} from './temporada-list/temporada-list.component';
import {TemporadaAddComponent} from './temporada-add/temporada-add.component';
import {TemporadaEditComponent} from './temporada-edit/temporada-edit.component';
import { TemporadaResolverService } from '../resolvers/temporada-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: TemporadaListComponent,
  },
  {
    path: 'add',
    component: TemporadaAddComponent,
  },
  {
    path: 'edit/:id',
    component: TemporadaEditComponent,
    resolve: {
      temporada: TemporadaResolverService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemporadaRoutingModule {
}
