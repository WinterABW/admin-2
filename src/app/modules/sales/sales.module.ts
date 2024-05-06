import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './components/sales/sales.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountUpModule } from "ngx-countup";
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { PaymentStatePipe } from 'src/app/pipes/payment-state.pipe';


@NgModule({
  declarations: [
    SalesComponent,
    PaymentStatePipe
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    CommonComponentsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    NgxChartsModule,
    NgSelectModule,
    CountUpModule,
  ]
})
export class SalesModule {
}
