import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PlaylistService} from '../../services/playlist.service';

@Component({
  selector: 'app-playlist-edit',
  templateUrl: './playlist-edit.component.html',
  styleUrls: ['./playlist-edit.component.scss']
})
export class PlaylistEditComponent implements OnInit {
  canales: any[] = [];
  playlist: any;

  constructor(
    private dialogRef: MatDialogRef<PlaylistEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private playlistService: PlaylistService
  ) {
    this.canales = this.data.canales;
    this.playlist = this.data.playlist;
  }

  ngOnInit() {
  }

  dismiss() {
    this.dialogRef.close();
  }

  accept(playlist: any) {
    this.playlistService.update(playlist).subscribe(() => {
      this.dialogRef.close(true);
    });

  }
}
