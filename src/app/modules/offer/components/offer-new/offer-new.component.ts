import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../../services/offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-new',
  templateUrl: './offer-new.component.html',
  styleUrls: ['./offer-new.component.scss']
})
export class OfferNewComponent implements OnInit {

  constructor(
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  save(offer: any) {
    this.offerService.create(offer).subscribe(data => {
      this.snackBar.open('Ofertada creada correctamente');
      this.router.navigateByUrl('/ofertas');
    });
  }
}
