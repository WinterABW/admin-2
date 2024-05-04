import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-post-list-dialog',
  templateUrl: './post-list-dialog.component.html',
  styleUrls: ['./post-list-dialog.component.scss']
})
export class PostListDialogComponent implements OnInit {
  options = {
    suppressScrollX: true
  };

  constructor(
    public dialogRef: MatDialogRef<PostListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  get publicaciones() {
    return this.data.publicacion;
  }

  ngOnInit(): void {
  }

}
