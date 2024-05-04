import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GeneroRoutingModule} from './genero-routing.module';
import {GeneroListComponent} from './components/genero-list/genero-list.component';
import {GeneroTableComponent} from './components/genero-table/genero-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {GeneroFormComponent} from './components/genero-form/genero-form.component';

import {ReactiveFormsModule} from '@angular/forms';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';



@NgModule({
  declarations: [GeneroListComponent, GeneroTableComponent, GeneroFormComponent],
  imports: [
    CommonModule,
    GeneroRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule,
  ]
})
export class GeneroModule { }
