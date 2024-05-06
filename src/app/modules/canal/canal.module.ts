import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CanalRoutingModule} from './canal-routing.module';
import {CanalListComponent} from './components/canal-list/canal-list.component';
import {CanalAddComponent} from './components/canal-add/canal-add.component';
import {CanalEditComponent} from './components/canal-edit/canal-edit.component';
import {CanalSubscriptionsDialogComponent} from './components/canal-subscriptions-dialog/canal-subscriptions-dialog.component';
import {CanalBottomsheetComponent} from './components/canal-bottomsheet/canal-bottomsheet.component';
import {DetailsCanalComponent} from './components/details-canal/details-canal.component';

import {ReactiveFormsModule} from '@angular/forms';

import {CdkTableModule} from '@angular/cdk/table';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [
    CanalListComponent,

    CanalAddComponent,

    CanalEditComponent,

    CanalSubscriptionsDialogComponent,

    CanalBottomsheetComponent,

    DetailsCanalComponent,

  ],
  imports: [
    CommonModule,
    CanalRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    CdkTableModule
  ]
})
export class CanalModule {
}
