import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitaRoutingModule } from './visita-routing.module';
import { VisitasComponent } from './components/visitas/visitas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatNativeDateModule } from '@angular/material/core';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker'
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonComponentsModule } from 'src/app/common/common-components.module';

@NgModule({
  declarations: [
    VisitasComponent
  ],
  imports: [
    CommonModule,
    VisitaRoutingModule,
    DemoMaterialModule,
    CommonComponentsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    
  ]
})
export class VisitaModule { }
