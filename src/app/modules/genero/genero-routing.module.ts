import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneroListComponent} from './components/genero-list/genero-list.component';

const routes: Routes = [
  {
    path: '',
    component: GeneroListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneroRoutingModule { }
