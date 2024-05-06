import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './components/event/event.component';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EventAddComponent } from './components/event-add/event-add.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { CommonComponentsModule } from 'src/app/common/common-components.module';

//import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
  declarations: [
    EventComponent,
    EventAddComponent,
    EventEditComponent,
    EventFormComponent,
    UsersDialogComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    CommonComponentsModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    DemoMaterialModule,
    NgSelectModule,
  ],
})
export class EventModule {
}
