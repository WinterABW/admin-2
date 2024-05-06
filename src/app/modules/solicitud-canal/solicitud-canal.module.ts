import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SolicitudCanalRoutingModule} from './solicitud-canal-routing.module';
import {SolicitudCanalComponent} from './components/solicitud-canal/solicitud-canal.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CreateSolicitudComponent} from './components/create-solicitud/create-solicitud.component';
import {SolicitudCanalFormComponent} from './components/solicitud-canal-form/solicitud-canal-form.component';
import {EditSolicitudCanalComponent} from './components/edit-solicitud-canal/edit-solicitud-canal.component';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [SolicitudCanalComponent, CreateSolicitudComponent, SolicitudCanalFormComponent, EditSolicitudCanalComponent],
  imports: [
    CommonModule,
    SolicitudCanalRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    DemoMaterialModule,
    CommonComponentsModule
  ]
})
export class SolicitudCanalModule {
}
