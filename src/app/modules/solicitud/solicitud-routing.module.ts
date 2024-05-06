import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudNewComponent } from './components/solicitud-new/solicitud-new.component';
import { SolicitudEditComponent } from './components/solicitud-edit/solicitud-edit.component';
import { SolicitudResolverService } from './services/solicitud-resolver.service';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SolicitudComponent,
    canActivate: [AuthGuard],
    data: { permiso: ['view_seller_solicitud'] },
  },
  {
    path: 'add',
    component: SolicitudNewComponent,
    canActivate: [AuthGuard],
    data: { permiso: ['add_seller_solicitud'] },
  },
  {
    path: 'edit/:id',
    component: SolicitudEditComponent,
    resolve: {
      solicitud: SolicitudResolverService
    },
    canActivate: [AuthGuard],
    data: { permiso: ['change_seller_solicitud'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudRoutingModule { }
