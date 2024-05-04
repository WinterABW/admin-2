import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellerComponent } from './components/seller/seller.component';
import { SellerEditComponent } from "./components/seller-edit/seller-edit.component";
import { SellerResolveService } from "../../services/seller-resolve.service";

const routes: Routes = [
  {
    path: '',
    component: SellerComponent
  }, {
    path: 'edit/:id',
    component: SellerEditComponent,
    resolve: {
      seller: SellerResolveService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
