import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComentarioListComponent} from "./comentario-list/comentario-list.component";

const routes: Routes = [
  {
    path: '',
    component: ComentarioListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComentarioRoutingModule {
}
