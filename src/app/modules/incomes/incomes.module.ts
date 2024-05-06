import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IncomesRoutingModule} from './incomes-routing.module';
import {IncomesComponent} from './components/incomes/incomes.component';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [
    IncomesComponent,
  ],
    imports: [
        CommonModule,
        IncomesRoutingModule,
        CommonComponentsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NgSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatButtonToggleModule,
        MatButtonModule,
        DemoMaterialModule
    ]
})
export class Incomes {
}
