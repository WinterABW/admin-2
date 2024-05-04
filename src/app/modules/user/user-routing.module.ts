import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { AuthGuard } from '../../guards/auth.guard';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserResolverService } from '../resolvers/user-resolver.service';
import { GruposResolverService } from '../resolvers/grupos-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { permiso: ['list_usuario'] }
  },
  {
    path: 'edit/:id',
    component: UserEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      grupos: GruposResolverService
    },
    data: { permiso: ['change_usuario'] }
  }
  , {
    path: 'add',
    component: UserAddComponent,
    canActivate: [AuthGuard],
    resolve: {
      grupos: GruposResolverService
    },
    data: { permiso: ['crear_admin_usuario'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
