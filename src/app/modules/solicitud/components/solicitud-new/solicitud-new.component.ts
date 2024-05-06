import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-solicitud-new',
  templateUrl: './solicitud-new.component.html',
  styleUrls: ['./solicitud-new.component.scss']
})
export class SolicitudNewComponent implements OnInit {

  constructor(
    private solicitudService: SolicitudService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  save({ solicitud, aceptada }) {
    delete solicitud.provider_streaming;
    delete solicitud.provider_download;
    const sol = {
      tipo: 'seller',
      data: solicitud
    };
    this.solicitudService.create(sol).subscribe(created => {
      this.router.navigateByUrl('/solicitud');
    }, error => {
      if (error.status === 400) {
        this.snackBar.open(error.error[0] ? error.error[0] : 'Error al crear la solicitud.');
      }
    });
  }
}
