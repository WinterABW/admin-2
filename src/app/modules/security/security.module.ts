import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './components/security/security.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupFormComponent } from './components/group-form/group-form.component';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [SecurityComponent, GroupFormComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ]
})
export class SecurityModule { }
