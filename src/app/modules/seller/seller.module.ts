import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SellerRoutingModule} from './seller-routing.module';
import {SellerComponent} from './components/seller/seller.component';
import {ReactiveFormsModule} from '@angular/forms';

import {CdkTableModule} from '@angular/cdk/table';
import {SellerBottomsheetComponent} from './components/seller-bottomsheet/seller-bottomsheet.component';
import {DetailsSellerComponent} from './components/details-seller/details-seller.component';

import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { SellerFormComponent } from './components/seller-form/seller-form.component';
import { SellerEditComponent } from './components/seller-edit/seller-edit.component';
import {NgSelectModule} from "@ng-select/ng-select";
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
  declarations: [SellerComponent, SellerBottomsheetComponent, DetailsSellerComponent, SellerFormComponent, SellerEditComponent],
  imports: [
    CommonModule,
    SellerRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    CdkTableModule,
    CommonComponentsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgSelectModule
  ]
})
export class SellerModule {
}
