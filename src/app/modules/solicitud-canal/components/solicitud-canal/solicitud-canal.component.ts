import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from '../../../solicitud/model/solicitud';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../../services/auth.service';
import { SolicitudService } from '../../../solicitud/services/solicitud.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { SolicitudBottomsheetComponent } from '../../../solicitud/components/solicitud-bottomsheet/solicitud-bottomsheet.component';
import { debounceTime, distinctUntilChanged, finalize, shareReplay } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { CommentDialogComponent } from 'src/app/common/components/comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-solicitud-canal',
  templateUrl: './solicitud-canal.component.html',
  styleUrls: ['./solicitud-canal.component.scss']
})
export class SolicitudCanalComponent implements OnInit {
  solicitudes: Solicitud[];
  filtersForm: UntypedFormGroup;
  displayedColumns: string[] = ['fecha', 'nombre', 'email', 'estado', 'operations'];
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
        this.solicitudService.update({ id: solicitud.id, aceptada: !solicitud.aceptada }).subscribe(
          () => {
            solicitud.aceptada = !solicitud.aceptada;
            this.snackBar.open('Solicitud actualizada correctamente.');
            this.loadData();
          },
          ({ error }) => {
            this.snackBar.open(error.detail || error.error[0] || 'No se pudo actualizar la solicitud.');
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
    /*  if (params.search){
        params.search = 'data__name|' + params.search;
      } else {
        delete params.search;
      }*/
    if (params.aceptada === '') {
      delete params.aceptada;
    }
    this.solicitudService.getAll(params)
      .pipe(finalize(() => this.loading = false))
      .subscribe(data => {
        this.solicitudes = data.results;
        this.paginator.length = data.count;
        this.total = data.count;
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
        if ($event.value.toUpperCase() === 'DENEGADA') {
          const dialogR = this.dialog.open(CommentDialogComponent, {
            data: {
              title: 'Escriba la observación para notificar la denegacion del canal'
            }
          });

          dialogR.afterClosed().subscribe(observacion => {
            if (observacion) {
              this.solicitudService.update({ id, estado: $event.value, observacion }).subscribe(
                () => {
                  this.loadData();
                },
                ({ error }) => {
                  this.snackBar.open(error.detail || error.error[0] || 'No se pudo actualizar la solicitud.');
                }
              );
            } else {
              this.loadData();
            }
          });
        } else {
          this.solicitudService.update({ id, estado: $event.value }).subscribe(
            () => {
              this.loadData();
            },
            ({ error }) => {
              this.snackBar.open(error.detail || error.error[0] || 'No se pudo actualizar la solicitud.');
            }
          );
        }
      } else {
        this.loadData();
      }
    });
  }

  private initFilters() {
    this.filtersForm = this.fb.group({
      page: [1],
      page_size: [10],
      estado: [''],
      data_canal_nombre__contains: [''],
      tipo: 'creacion_canal'
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

  export() {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    ws['!ref'] = ws['!ref'].replace('F', 'E');
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes de canal');

    /* save to file */
    XLSX.writeFile(wb, 'Solicitudes de canal.xlsx');
  }
}
