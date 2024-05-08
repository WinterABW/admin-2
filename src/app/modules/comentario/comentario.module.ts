import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarioListComponent } from './comentario-list/comentario-list.component';

import { ComentarioRoutingModule } from './comentario-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ComentarioBottomsheetComponent } from './comentario-bottomsheet/comentario-bottomsheet.component';

import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ContactsComponent } from 'src/app/dashboard/dashboard-components/contacts/contacts.component';
import { ActivityTimelineComponent } from 'src/app/common/components/activity-timeline/activity-timeline.component';
import { ProfileComponent } from 'src/app/dashboard/dashboard-components/profile/profile.component';

@NgModule({
  declarations: [ComentarioListComponent, ComentarioBottomsheetComponent],
  imports: [
    CommonModule,
    ComentarioRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    ActivityTimelineComponent,
  ],
})
export class ComentarioModule {}
