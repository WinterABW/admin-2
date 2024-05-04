import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TipologiaComponent} from './tipologia/tipologia.component';

const routes: Routes = [
  {
    path: '',
    component: TipologiaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipologiaRoutingModule {
}
