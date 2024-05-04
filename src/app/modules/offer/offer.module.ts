import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferRoutingModule } from './offer-routing.module';
import { OfferComponent } from './components/offer/offer.component';
import { OfferFormComponent } from './components/offer-form/offer-form.component';
import { OfferNewComponent } from './components/offer-new/offer-new.component';
import { OfferEditComponent } from './components/offer-edit/offer-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
  declarations: [OfferComponent, OfferFormComponent, OfferNewComponent, OfferEditComponent],
  imports: [
    CommonModule,
    OfferRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CommonComponentsModule
  ]
})
export class OfferModule { }
