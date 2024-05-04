import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Seller } from 'src/app/models/payment';

@Component({
  selector: 'app-seller-edit',
  templateUrl: './seller-edit.component.html',
  styleUrls: ['./seller-edit.component.scss']
})
export class SellerEditComponent implements OnInit {
  seller: Seller;

  constructor(
    private route: ActivatedRoute
  ) {
    this.seller = this.route.snapshot.data['seller'][0];
  }

  ngOnInit(): void {
  }

}
