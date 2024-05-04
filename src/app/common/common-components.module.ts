import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageComponent} from './components/page/page.component';
import {RouterModule} from '@angular/router';
import {StatCardComponent} from './components/stat-card/stat-card.component';
import {CountUpModule} from 'ngx-countup';
import {ListCardComponent} from './components/list-card/list-card.component';
import {ChartCardComponent} from './components/chart-card/chart-card.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DemoMaterialModule } from '../demo-material-module';

const components = [
  PageComponent,
  StatCardComponent
];

@NgModule({
  declarations: [
    components,
    ListCardComponent,
    ChartCardComponent,
    ConfirmDialogComponent
  ],
  exports: [
    components,
    ListCardComponent,
    ChartCardComponent,
    DemoMaterialModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    CountUpModule,
    NgApexchartsModule,
    DemoMaterialModule
  ]
})
export class CommonComponentsModule {
}
