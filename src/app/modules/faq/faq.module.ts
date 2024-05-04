import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqAddComponent } from './faq-add/faq-add.component';
import { FaqRoutingModule } from './faq-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [FaqListComponent, FaqAddComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ]
})
export class FaqModule {
}
