import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanalListComponent} from './components/canal-list/canal-list.component';
import {AuthGuard} from '../../guards/auth.guard';
import {CanalAddComponent} from './components/canal-add/canal-add.component';
import {CanalEditComponent} from './components/canal-edit/canal-edit.component';
import { SellersResolveService } from 'src/app/services/sellers-resolve.service';
import { UsersResolverService } from '../resolvers/users-resolver.service';
import { KeywordsResolverService } from '../resolvers/keywords-resolver.service';
import { CanalResolverService } from '../resolvers/canal-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: CanalListComponent,
    canActivate: [AuthGuard],
    data: {permiso: ['list_canal']}
  },
  {
    path: 'add',
    component: CanalAddComponent,
    canActivate: [AuthGuard],
    resolve: {
      users: UsersResolverService,
      palabrasClaves: KeywordsResolverService,
      sellers: SellersResolveService
    },
    data: {permiso: ['add_canal']}
  },
  {
    path: 'edit/:slug_url',
    component: CanalEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      canal: CanalResolverService,
      sellers: SellersResolveService
    },
    data: {permiso: ['change_canal']}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanalRoutingModule {
}
