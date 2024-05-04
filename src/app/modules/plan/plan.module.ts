import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './components/plan/plan.component';

import { PlanFormComponent } from './components/plan-form/plan-form.component';
import { PlanCreateComponent } from './components/plan-create/plan-create.component';
import { PlanEditComponent } from './components/plan-edit/plan-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [
    PlanComponent,
    PlanFormComponent,
    PlanCreateComponent,
    PlanEditComponent
  ],
  imports: [
    CommonModule,
    PlanRoutingModule,
    DemoMaterialModule,
    CommonComponentsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()]
})
export class PlanModule { }
