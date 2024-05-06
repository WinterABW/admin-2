import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-live-new',
  templateUrl: './live-new.component.html',
  styleUrls: ['./live-new.component.scss']
})
export class LiveNewComponent implements OnInit {
  clave;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar,
  ) {
    this.clave = this.route.snapshot.data['clave'];
  }

  ngOnInit(): void {
  }

  save(live: any) {
    this.publicationService.create(live, 'live').subscribe(response => {
      this.snackBar.open('Directa creada correctamente');
      this.router.navigateByUrl('/live');
    });
  }
}
