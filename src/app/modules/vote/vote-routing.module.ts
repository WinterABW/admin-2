import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VotesComponent} from './components/votes/votes.component';

const routes: Routes = [
  {
    path: '',
    component: VotesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoteRoutingModule { }
