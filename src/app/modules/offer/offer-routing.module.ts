import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferComponent } from './components/offer/offer.component';
import { OfferNewComponent } from './components/offer-new/offer-new.component';
import { OfferEditComponent } from './components/offer-edit/offer-edit.component';
import { OfferResolverService } from '../../services/offer-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: OfferComponent,
    pathMatch: 'full'
  },
  {
    path: 'adicionar',
    component: OfferNewComponent
  },
  {
    path: 'editar/:id',
    component: OfferEditComponent,
    resolve: {
      offer: OfferResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferRoutingModule { }
