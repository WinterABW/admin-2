import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRoutingModule } from './live-routing.module';
import { LiveFormComponent } from './components/live-form/live-form.component';
import { LiveComponent } from './components/live/live.component';
import { LiveNewComponent } from './components/live-new/live-new.component';
import { LiveEditComponent } from './components/live-edit/live-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LiveBottomsheetComponent } from './components/live-bottomsheet/live-bottomsheet.component';

import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
  declarations: [
    LiveFormComponent,
    LiveComponent,
    LiveNewComponent,
    LiveEditComponent,
    LiveBottomsheetComponent,
  ],
  imports: [
    CommonModule,
    LiveRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    CommonComponentsModule,
  ],
})
export class LiveModule {}
