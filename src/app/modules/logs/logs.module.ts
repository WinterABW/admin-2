import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { LogsRoutingModule } from './logs-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { LogsListComponent } from './components/logs-list/logs-list.component';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [ LogsListComponent],
  imports: [
    CommonModule,
    LogsRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    CdkTableModule
  ]
})
export class LogsModule {
}
