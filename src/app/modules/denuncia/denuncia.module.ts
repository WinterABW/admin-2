import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DenunciaRoutingModule} from './denuncia-routing.module';
import {DenunciaListComponent} from './components/denuncia-list/denuncia-list.component';

import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [
    DenunciaListComponent,

  ],
  imports: [
    CommonModule,
    DenunciaRoutingModule,
    DemoMaterialModule,
    CommonComponentsModule,
  ]
})
export class DenunciaModule {
}
