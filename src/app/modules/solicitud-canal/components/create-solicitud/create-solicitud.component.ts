import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../../solicitud/services/solicitud.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-solicitud',
  templateUrl: './create-solicitud.component.html',
  styleUrls: ['./create-solicitud.component.scss']
})
export class CreateSolicitudComponent implements OnInit {

  constructor(
    private solicitudService: SolicitudService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  create(solicitud: any) {
    this.solicitudService.create(solicitud).subscribe(() => {
      this.snackBar.open('Su solicitud ha sido enviada correctamente.');
      this.router.navigateByUrl('/solicitud-canal');
    });
  }
}
