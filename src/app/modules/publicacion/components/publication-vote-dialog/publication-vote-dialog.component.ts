import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-publication-vote-dialog',
  templateUrl: './publication-vote-dialog.component.html',
  styleUrls: ['./publication-vote-dialog.component.scss']
})
export class PublicationVoteDialogComponent implements OnInit {

  options = {
    suppressScrollX: true
  };

  constructor(
    public dialogRef: MatDialogRef<PublicationVoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

}
