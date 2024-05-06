import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { PlaylistResolverService } from './services/playlist-resolver.service';
import { CanalesResolverService } from './services/canales-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: PlaylistComponent,
    resolve: {
      playlists: PlaylistResolverService,
      canales: CanalesResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule {
}
