import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserPlaylistRoutingModule} from './user-playlist-routing.module';
import {UserPlaylistComponent} from './components/user-playlist/user-playlist.component';
import {UserPlaylistTableComponent} from './components/user-playlist-table/user-playlist-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

import {PostListDialogComponent} from './components/post-list-dialog/post-list-dialog.component';

import {PlaylistBottomSheetComponent} from './components/user-playlist-bottom-sheet/playlist-bottom-sheet.component';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';



@NgModule({
  declarations: [
    UserPlaylistComponent,
    UserPlaylistTableComponent,
    PostListDialogComponent,
    PlaylistBottomSheetComponent
  ],
    imports: [
      CommonModule,
      UserPlaylistRoutingModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      DemoMaterialModule,
      CommonComponentsModule
    ]
})
export class UserPlaylistModule {
}
