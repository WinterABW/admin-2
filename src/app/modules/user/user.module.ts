import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserBottomsheetComponent } from './components/user-bottomsheet/user-bottomsheet.component';
import { DetailsUserComponent } from './components/details-user/details-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { MatChipsModule } from '@angular/material/chips';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { GetRolesPipe } from '../pipes/get-roles.pipe';

@NgModule({
  declarations: [
    UserListComponent,
    GetRolesPipe,
    UserEditComponent,
    ChangePasswordDialogComponent,
    UserAddComponent,
    UserBottomsheetComponent,
    DetailsUserComponent

  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatChipsModule
  ],
  providers: [provideNgxMask()]
})
export class UserModule {
}
