import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-solicitud-bottomsheet',
  templateUrl: './solicitud-bottomsheet.component.html',
  styleUrls: ['./solicitud-bottomsheet.component.scss']
})
export class SolicitudBottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<SolicitudBottomsheetComponent>
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
