import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TipologiaRoutingModule} from './tipologia-routing.module';
import {ReactiveFormsModule} from '@angular/forms';

import {TipologiaComponent} from "./tipologia/tipologia.component";
import { NotificationComponent } from 'src/app/common/notification/notification.component';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
  declarations: [
    TipologiaComponent,
    NotificationComponent

  ],
  imports: [
    CommonModule,
    TipologiaRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
  ]
})
export class TipologiaModule {
}
