import {Component, OnInit, ViewChild} from '@angular/core';
import {UserPlaylistTableComponent} from '../user-playlist-table/user-playlist-table.component';

@Component({
  selector: 'app-user-playlist',
  templateUrl: './user-playlist.component.html',
  styleUrls: ['./user-playlist.component.scss']
})
export class UserPlaylistComponent implements OnInit {
  @ViewChild(UserPlaylistTableComponent) table: UserPlaylistTableComponent;

  constructor() {
  }

  ngOnInit(): void {

  }

  refresh() {
    this.table.dataSource.loadPlaylists();
  }
}
