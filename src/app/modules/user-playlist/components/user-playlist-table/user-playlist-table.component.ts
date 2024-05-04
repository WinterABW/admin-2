import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {UserPlaylistTableDataSource} from './user-playlist-table-datasource';
import {UserPlaylistService} from '../../services/user-playlist.service';
import {UserPlaylist} from '../../models/user-playlist';
import {MatDialog} from '@angular/material/dialog';

import {AuthService} from '../../../../services/auth.service';
import {PostListDialogComponent} from '../post-list-dialog/post-list-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {PlaylistBottomSheetComponent} from '../user-playlist-bottom-sheet/playlist-bottom-sheet.component';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-playlist-table',
  templateUrl: './user-playlist-table.component.html',
  styleUrls: ['./user-playlist-table.component.scss']
})
export class UserPlaylistTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<UserPlaylist>;
  @ViewChild('postList') postList: ElementRef;
  dataSource: UserPlaylistTableDataSource;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nombre', 'fecha', 'usuario', 'publicaciones', 'operaciones'];
  total: any;

  constructor(
    private userPlaylistService: UserPlaylistService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.dataSource = new UserPlaylistTableDataSource(this.userPlaylistService);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.loadPlaylists();
    this.dataSource.listenPaginate();
  }

  delete({id}) {
    const dialog = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          msg: '¿Estás seguro que deseas eliminar esta lista?'
        }
      });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.userPlaylistService.delete(id).subscribe(() => {
          this.dataSource.loadPlaylists();
        });
      }
    });
  }

  openPostList({publicacion}) {
    this.dialog.open(PostListDialogComponent, {
      data: {
        publicacion
      }
    });
  }

  openBottomSheet(playlist: any) {
    const ref = this.bottomSheet.open(PlaylistBottomSheetComponent, {
      data: {
        playlist
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.delete(playlist);
      }
    });
  }

  paginate(data) {
    this.dataSource.filters.page = data.pageIndex + 1;
    this.dataSource.filters.page_size = data.pageSize;
    this.dataSource.loadPlaylists();
  }
}
