import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})
export class UsersDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { evento: any }
  ) {
  }

  ngOnInit(): void {
  }

}
