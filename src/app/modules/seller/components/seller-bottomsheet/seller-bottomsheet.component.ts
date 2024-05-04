import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-seller-bottomsheet',
  templateUrl: './seller-bottomsheet.component.html',
  styleUrls: ['./seller-bottomsheet.component.scss']
})
export class SellerBottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<SellerBottomsheetComponent>
  ) { }

  ngOnInit(): void {
  }

  delete() {
    this.bsRef.dismiss('delete');
  }

  seeDetails() {
    this.bsRef.dismiss('details');
  }

  toggleVisibility() {
    this.bsRef.dismiss('toggle-visibility');
  }

}
