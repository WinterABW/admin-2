import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashRoutingModule } from './dash-routing.module';

import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PublicationDashComponent } from './publication-dash/publication-dash.component';
import { GraphDashComponent } from './graph-dash/graph-dash.component';
import { DateRangeDialogComponent } from './date-range-dialog/date-range-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PublicationDashComponent,
    GraphDashComponent,
    DateRangeDialogComponent,
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
    CommonComponentsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DashModule { }
