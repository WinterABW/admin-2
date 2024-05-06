import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-canal-bottomsheet',
  templateUrl: './canal-bottomsheet.component.html',
  styleUrls: ['./canal-bottomsheet.component.scss']
})
export class CanalBottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<CanalBottomsheetComponent>
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
