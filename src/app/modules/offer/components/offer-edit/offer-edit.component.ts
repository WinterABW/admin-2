import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../../services/offer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.scss']
})
export class OfferEditComponent implements OnInit {
  offer;

  constructor(
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offer = this.route.snapshot.data['offer'];
  }

  ngOnInit(): void {
  }

  save(offer: any) {
    this.offerService.update(this.offer.id, offer).subscribe(data => {
      this.snackBar.open('Ofertada actualizada correctamente');
      this.router.navigateByUrl('/ofertas');
    });
  }

}
