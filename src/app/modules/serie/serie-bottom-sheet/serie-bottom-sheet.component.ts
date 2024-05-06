import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-serie-bottom-sheet',
  templateUrl: './serie-bottom-sheet.component.html',
  styleUrls: ['./serie-bottom-sheet.component.scss']
})
export class SerieBottomSheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<SerieBottomSheetComponent>
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.bsRef.dismiss('delete');
  }

}
