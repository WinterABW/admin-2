import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudCanalComponent } from './components/solicitud-canal/solicitud-canal.component';
import { CreateSolicitudComponent } from './components/create-solicitud/create-solicitud.component';
import { EditSolicitudCanalComponent } from './components/edit-solicitud-canal/edit-solicitud-canal.component';
import { SolicitudResolverService } from './services/solicitud-resolver.service';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SolicitudCanalComponent,
    canActivate: [AuthGuard],
    data: { permiso: ['view_canal_solicitud'] },
  },
  {
    path: 'create',
    component: CreateSolicitudComponent,
    canActivate: [AuthGuard],
    data: { permiso: ['add_canal_solicitud'] },
  },
  {
    path: 'edit/:id',
    component: EditSolicitudCanalComponent,
    resolve: {
      solicitud: SolicitudResolverService
    },
    canActivate: [AuthGuard],
    data: { permiso: ['change_canal_solicitud'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudCanalRoutingModule {
}
