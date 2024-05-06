import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../guards/auth.guard';
import {PublicationAddComponent} from './components/publication-add/publication-add.component';
import {PublicationEditComponent} from './components/publication-edit/publication-edit.component';
import {PublicacionResolverService} from '../../services/publicacion-resolver.service';
import {PublicationListResolverService} from '../../services/publication-list-resolver.service';
import {PublicationListComponent} from './components/publication-list/publication-list.component';

const routes: Routes = [
  {
    path: '',
    component: PublicationListComponent,
    canActivate: [AuthGuard],
    resolve: {
      list: PublicationListResolverService
    },
    data: {permiso: ['list_publicacion']},
  },
  {
    path: 'add',
    component: PublicationAddComponent,
    canActivate: [AuthGuard],
    data: {permiso: ['add_publicacion']}
  },
  {
    path: 'edit/:slug_url',
    component: PublicationEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      publicacion: PublicacionResolverService
    },
    data: {permiso: ['change_publicacion']},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicacionRoutingModule {
}
