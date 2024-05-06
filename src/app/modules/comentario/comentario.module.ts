import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComentarioListComponent} from './comentario-list/comentario-list.component';

import {ComentarioRoutingModule} from './comentario-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ComentarioBottomsheetComponent} from './comentario-bottomsheet/comentario-bottomsheet.component';

import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [ComentarioListComponent, ComentarioBottomsheetComponent],
  imports: [
    CommonModule,
    ComentarioRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ]
})
export class ComentarioModule {
}
