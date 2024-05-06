import {Component, OnInit} from '@angular/core';
import {SolicitudService} from '../../../solicitud/services/solicitud.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-solicitud-canal',
  templateUrl: './edit-solicitud-canal.component.html',
  styleUrls: ['./edit-solicitud-canal.component.scss']
})
export class EditSolicitudCanalComponent implements OnInit {
  solicitud: any;

  constructor(
    private solicitudService: SolicitudService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.solicitud = this.route.snapshot.data['solicitud'];
  }

  ngOnInit(): void {
  }

  edit(solicitud: any) {
    this.solicitudService.update({id: this.solicitud.id, data: {...solicitud}}).subscribe(() => {
      this.snackBar.open('Su solicitud ha sido enviada correctamente.');
      this.router.navigateByUrl('/solicitud-canal');
    });
  }

}
