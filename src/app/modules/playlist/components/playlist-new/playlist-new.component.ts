import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PlaylistService} from '../../services/playlist.service';

@Component({
  selector: 'app-playlist-new',
  templateUrl: './playlist-new.component.html',
  styleUrls: ['./playlist-new.component.scss']
})
export class PlaylistNewComponent implements OnInit {
  canales: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<PlaylistNewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private playlistService: PlaylistService
  ) {
    this.canales = this.data.canales;
  }

  ngOnInit() {
  }

  dismiss() {
    this.dialogRef.close();
  }

  accept(playlist: any) {
    this.playlistService.create(playlist.list).subscribe((res) => this.dialogRef.close(res));
  }
}
