import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-canal-subscriptions-dialog',
  templateUrl: './canal-subscriptions-dialog.component.html',
  styleUrls: ['./canal-subscriptions-dialog.component.scss']
})
export class CanalSubscriptionsDialogComponent implements OnInit {
  options = {
    suppressScrollX: true
  };

  constructor(
    public dialogRef: MatDialogRef<CanalSubscriptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

}
