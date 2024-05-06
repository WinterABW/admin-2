import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TemporadaRoutingModule} from './temporada-routing.module';

import {TemporadaListComponent} from './temporada-list/temporada-list.component';
import {TemporadaAddComponent} from './temporada-add/temporada-add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TemporadaEditComponent} from './temporada-edit/temporada-edit.component';
import {TemporadaBottomSheetComponent} from './temporada-bottom-sheet/temporada-bottom-sheet.component';

import {NgSelectModule} from '@ng-select/ng-select';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [TemporadaListComponent, TemporadaAddComponent, TemporadaEditComponent, TemporadaBottomSheetComponent],
  imports: [
    CommonModule,
    TemporadaRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    NgSelectModule
  ]
})
export class TemporadaModule {
}
