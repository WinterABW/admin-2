import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DenunciaListComponent } from './components/denuncia-list/denuncia-list.component';

const routes: Routes = [
  {
    path: '',
    component: DenunciaListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DenunciaRoutingModule {
}
