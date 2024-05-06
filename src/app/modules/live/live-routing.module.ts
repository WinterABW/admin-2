import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveComponent } from './components/live/live.component';
import { LiveNewComponent } from './components/live-new/live-new.component';
import { ClaveResolverService } from './services/clave-resolver.service';
import { LiveEditComponent } from './components/live-edit/live-edit.component';
import { LiveResolverService } from './services/live-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: LiveComponent,
    pathMatch: 'full'
  },
  {
    path: 'add',
    component: LiveNewComponent,
    resolve: {
      clave: ClaveResolverService
    }
  },
  {
    path: 'edit/:id',
    component: LiveEditComponent,
    resolve: {
      publicacion: LiveResolverService
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveRoutingModule {
}
