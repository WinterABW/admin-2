import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipologiaComponent } from './tipologia/tipologia.component';
import { TipologiaRoutingModule } from './tipologia-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
  declarations: [
    TipologiaComponent,
    //NotificationComponent
  ],
  imports: [
    CommonModule,
    TipologiaRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
  ]
})
export class TipologyModule { }
