import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoteRoutingModule } from './vote-routing.module';
import { VotesComponent } from './components/votes/votes.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatNativeDateModule} from '@angular/material/core';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
  declarations: [
    VotesComponent
  ],
  imports: [
    CommonModule,
    VoteRoutingModule,
    DemoMaterialModule,
    CommonComponentsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ]
})
export class VoteModule { }
