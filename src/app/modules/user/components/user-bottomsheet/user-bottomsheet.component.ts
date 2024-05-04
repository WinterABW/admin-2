import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-user-bottomsheet',
  templateUrl: './user-bottomsheet.component.html',
  styleUrls: ['./user-bottomsheet.component.scss']
})
export class UserBottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<UserBottomsheetComponent>
  ) { }

  ngOnInit(): void {
  }

  delete() {
    this.bsRef.dismiss('delete');
  }

  seeDetails() {
    this.bsRef.dismiss('details');
  }

  changePassword() {
    this.bsRef.dismiss('change-password');
  }

}
