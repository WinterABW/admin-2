import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { CountUpModule } from 'ngx-countup';
import { ListCardComponent } from './components/list-card/list-card.component';
import { ChartCardComponent } from './components/chart-card/chart-card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DemoMaterialModule } from '../demo-material-module';
import { AddDiscoFormComponent } from './components/add-disco-form/add-disco-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddTemporadaFormComponent } from './components/add-temporada-form/add-temporada-form.component';
import { AddSerieFormComponent } from './components/add-serie-form/add-serie-form.component';
import { CommentDialogComponent } from './components/comment-dialog/comment-dialog.component';

const components = [
  PageComponent,
  StatCardComponent,
  AddDiscoFormComponent,
  AddTemporadaFormComponent,
  AddSerieFormComponent
];

@NgModule({
  declarations: [
    components,
    ListCardComponent,
    ChartCardComponent,
    ConfirmDialogComponent,
    CommentDialogComponent
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
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class CommonComponentsModule {
}
