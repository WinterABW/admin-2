import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-comentario-bottomsheet',
  templateUrl: './comentario-bottomsheet.component.html',
  styleUrls: ['./comentario-bottomsheet.component.scss']
})
export class ComentarioBottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<ComentarioBottomsheetComponent>
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

  answer() {
    this.bsRef.dismiss('answer');
  }
}
