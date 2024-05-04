import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqAddComponent } from './faq-add/faq-add.component';

const routes: Routes = [
  {
    path: '',
    component: FaqListComponent,
  },
  {
    path: 'add-edit',
    component: FaqAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule {
}
