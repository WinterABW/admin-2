import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-publication-download-dialog',
  templateUrl: './publication-download-dialog.component.html',
  styleUrls: ['./publication-download-dialog.component.scss']
})
export class PublicationDownloadDialogComponent implements OnInit {
  options = {
    suppressScrollX: true
  };

  constructor(
    public dialogRef: MatDialogRef<PublicationDownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

}
