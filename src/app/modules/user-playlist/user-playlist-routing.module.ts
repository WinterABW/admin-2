import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserPlaylistComponent} from './components/user-playlist/user-playlist.component';

const routes: Routes = [
  {path: '', component: UserPlaylistComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPlaylistRoutingModule {
}
