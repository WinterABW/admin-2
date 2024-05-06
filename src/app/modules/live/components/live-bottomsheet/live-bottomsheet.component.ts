import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-live-bottomsheet',
  templateUrl: './live-bottomsheet.component.html',
  styleUrls: ['./live-bottomsheet.component.scss']
})
export class LiveBottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<LiveBottomsheetComponent>
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.bsRef.dismiss('delete');
  }

  toggleVisibility() {
    this.bsRef.dismiss('toggle-visibility');
  }

  stopLive() {
    this.bsRef.dismiss('stop-live');
  }
}
