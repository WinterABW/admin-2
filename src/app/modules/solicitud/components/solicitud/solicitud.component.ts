import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../model/solicitud';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, finalize, shareReplay } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SolicitudBottomsheetComponent } from '../solicitud-bottomsheet/solicitud-bottomsheet.component';
import { MatSelectChange } from "@angular/material/select";
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {
  solicitudes: Solicitud[];
  filtersForm: UntypedFormGroup;
  displayedColumns: string[] = ['tipo', 'fecha', 'nombre', 'email', 'providers', 'aceptada', 'operations'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  total: number;
  loading = true;

  constructor(
    public authService: AuthService,
    private solicitudService: SolicitudService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initFilters();
    this.loadData();
  }

  eliminar(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta solicitud?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.solicitudService.delete(id).subscribe(
          () => {
            this.snackBar.open('Solicitud eliminada correctamente.');
            this.loadData();
          },
          () => this.snackBar.open('No se pudo eliminar la solicitud.')
        );
      }
    });
  }

  paginate($event: PageEvent) {
    this.filtersForm.get('page').setValue($event.pageIndex + 1);
    this.filtersForm.get('page_size').setValue($event.pageSize);
    this.loadData();
  }

  accept(solicitud: Solicitud) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: `¿Está seguro que desea ${solicitud.aceptada ? 'denegar' : 'aceptar'}  esta solicitud?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        solicitud.aceptada = !solicitud.aceptada;
        this.solicitudService.update(solicitud).subscribe(
          () => {
            this.snackBar.open('Solicitud actualizada correctamente.');
            this.loadData();
          },
          ({ error }) => {
            this.snackBar.open(error.detail ? error.detail : 'No se pudo actualizar la solicitud.');
          }
        );
      }
    });
  }

  openBottomSheet(solicitud: Solicitud) {
    const ref = this.bottomSheet.open(SolicitudBottomsheetComponent, {
      data: {
        solicitud
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminar(solicitud.id);
      }
      /* if (result === 'details') {
         this.detailsCanal(canal);
       }*/
      if (result === 'toggle-visibility') {
        this.accept(solicitud);
      }
    });

  }

  loadData() {
    this.loading = true;
    const params = this.filtersForm.value;
    if (params.person_name__wildcard) {
      params.person_name__wildcard = `*${params.person_name__wildcard}*`;
    } else {
      delete params.person_name__wildcard;
    }
    this.solicitudService.getAll(params)
      .pipe(finalize(() => this.loading = false))
      .subscribe(data => {
        this.solicitudes = data.results;
        this.paginator.length = data.count;
        this.total = data.count;
      });
  }

  private initFilters() {
    this.filtersForm = this.fb.group({
      page: [1],
      page_size: [10],
      estado: [''],
      tipo: ['seller'],
      person_name__wildcard: ['']
    });
    this.filtersForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay()
    )
      .subscribe(value => {
        this.loadData();
      });
  }

  changeState($event: MatSelectChange, id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: `¿Está seguro que cambiar el estado de esta solicitud a ${$event.value.toUpperCase()}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.solicitudService.update({ id, estado: $event.value }).subscribe(value => {
          this.loadData();
        }
        );
      } else {
        this.loadData();

      }
    });

  }
}
