import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-temporada-bottom-sheet',
  templateUrl: './temporada-bottom-sheet.component.html',
  styleUrls: ['./temporada-bottom-sheet.component.scss']
})
export class TemporadaBottomSheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<TemporadaBottomSheetComponent>
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.bsRef.dismiss('delete');
  }
}
