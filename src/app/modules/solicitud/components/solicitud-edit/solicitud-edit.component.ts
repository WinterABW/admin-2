import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from '../../model/solicitud';
import { HotToastService } from "@ngneat/hot-toast";
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-solicitud-edit',
  templateUrl: './solicitud-edit.component.html',
  styleUrls: ['./solicitud-edit.component.scss']
})
export class SolicitudEditComponent implements OnInit {
  solicitud: Solicitud;
  form: UntypedFormGroup;
  constructor(
    private solicitudService: SolicitudService,
    private hotToastService: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
  ) {
    this.solicitud = this.route.snapshot.data['solicitud'];
  }

  ngOnInit(): void {
  }

  save({ solicitud, estado }: any) {
    const sol = {
      id: this.solicitud.id,
      estado,
      tipo: 'seller',
      data: solicitud
    };

    this.solicitudService.update(sol)
      .pipe(
        catchError(err => {
          this.hotToastService.error('Ocurrió un error al enviar la solicitud. Error:' + JSON.stringify(err.error));
          return throwError(err);
        }),
        finalize(() => {
          this.loaderService.hide();
          this.form.enable();
        })
      )
      .subscribe(() => {
        this.hotToastService.success('Su solicitud ha sido enviada correctamente.');
        this.form.reset();
        this.router.navigateByUrl('/profile/subscriptions');
      });

    /*     this.solicitudService.update(sol).subscribe(created => {
          this.router.navigateByUrl('/solicitud');
        }, error => {
          if (error.status === 400) {
            this.hotToastService.error(error.error[0] ? error.error[0] : 'Error al crear la solicitud.');
          } else {
            this.hotToastService.error(error.error.detail || error.error.message);
          }
        }); */
  }

}
