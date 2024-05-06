import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-publication-bottom-sheet',
  templateUrl: './publication-bottom-sheet.component.html',
  styleUrls: ['./publication-bottom-sheet.component.scss']
})
export class PublicationBottomSheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<PublicationBottomSheetComponent>
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

  toggleDownload() {
    this.bsRef.dismiss('toggle-download');
  }

  generateDownload() {
    this.bsRef.dismiss('generate-download');
  }

  convert() {
    this.bsRef.dismiss('convert');
  }
  stopLive() {
    this.bsRef.dismiss('stop-live');
  }
}
