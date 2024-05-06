import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-playlist-bottom-sheet',
  templateUrl: './playlist-bottom-sheet.component.html',
  styleUrls: ['./playlist-bottom-sheet.component.scss']
})
export class PlaylistBottomSheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public bsRef: MatBottomSheetRef<PlaylistBottomSheetComponent>
  ) { }

  ngOnInit(): void {
  }

  delete() {
    this.bsRef.dismiss('delete');
  }

}
