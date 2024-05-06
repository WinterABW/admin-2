import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-publication-reproduccion-dialog',
  templateUrl: './publication-reproduccion-dialog.component.html',
  styleUrls: ['./publication-reproduccion-dialog.component.scss']
})
export class PublicationReproduccionDialogComponent implements OnInit {

  options = {
    suppressScrollX: true
  };

  constructor(
    public dialogRef: MatDialogRef<PublicationReproduccionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }
}
