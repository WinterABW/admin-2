import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details-seller',
  templateUrl: './details-seller.component.html',
  styleUrls: ['./details-seller.component.scss']
})
export class DetailsSellerComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
  }

}
