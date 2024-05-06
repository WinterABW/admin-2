import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Live} from '../../../../models/live';
import {Publicacion} from '../../../../models/publicacion';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-live-edit',
  templateUrl: './live-edit.component.html',
  styleUrls: ['./live-edit.component.scss']
})
export class LiveEditComponent implements OnInit {
  publicacion: Publicacion;
  live: Live;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar,
  ) {
    this.live = this.route.snapshot.data['publicacion'];
  }

  ngOnInit(): void {
//    this.buildLiveFromPublication();
  }

  save(live: any) {
    this.publicationService.update(this.live.id, live).subscribe(response => {
      this.snackBar.open('Directa actualizada correctamente');
      this.router.navigateByUrl('/live');
    });
  }

  private buildLiveFromPublication() {
    this.live = this.publicacion.live;
  }
}
