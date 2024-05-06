import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SolicitudRoutingModule} from './solicitud-routing.module';
import {SolicitudComponent} from './components/solicitud/solicitud.component';
import {SolicitudFormComponent} from './components/solicitud-form/solicitud-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SolicitudNewComponent} from './components/solicitud-new/solicitud-new.component';
import {SolicitudEditComponent} from './components/solicitud-edit/solicitud-edit.component';
import {SolicitudBottomsheetComponent} from './components/solicitud-bottomsheet/solicitud-bottomsheet.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [SolicitudComponent, SolicitudFormComponent, SolicitudNewComponent, SolicitudEditComponent, SolicitudBottomsheetComponent],
    imports: [
        CommonModule,
        SolicitudRoutingModule,
        DemoMaterialModule,
        ReactiveFormsModule,
        CommonComponentsModule,
        NgSelectModule,
        FormsModule
    ]
})
export class SolicitudModule { }
