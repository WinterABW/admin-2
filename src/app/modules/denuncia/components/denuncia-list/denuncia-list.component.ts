import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSelectChange} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Response} from '../../../../models/response';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {finalize} from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { DenunciaService } from 'src/app/services/denuncia.service';
import { Denuncia } from 'src/app/models/denuncia';

@Component({
  selector: 'app-denuncia-list',
  templateUrl: './denuncia-list.component.html',
  styleUrls: ['./denuncia-list.component.css']
})
export class DenunciaListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  denuncias: any[] = [];
  filtersForm: UntypedFormGroup;
  filters = {
    page: 1,
    page_size: 10
  };
  displayedColumns = ['usuario', 'fecha', 'tipo_denuncia', 'publicacion', 'evidencia', 'estado', 'operaciones'];
  loading = true;

  constructor(private denunciaService: DenunciaService, private dialog: MatDialog,
              private matSnackBar: MatSnackBar, private fb: UntypedFormBuilder,
              public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.filtersForm = this.fb.group({
      // Put filters here.
    });
    this.filtersForm.valueChanges.subscribe(() => {
      this.filters.page = 1;
      this.cargarDatos();
    });
    this.listenPaginator();
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    const filters = {...this.filters, ...this.filtersForm.value};

    this.denunciaService
      .getDenuncias(filters)
      .pipe(finalize(() => this.loading = false))

      .subscribe((respuesta: Response<Denuncia>) => {
        this.denuncias = respuesta.results;
        this.paginator.length = respuesta.count;
      });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta denuncia?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.denunciaService.delete(id).subscribe(
          () => {
            this.matSnackBar.open('Denuncia eliminada correctamente.');

            this.cargarDatos();

          },
          () => this.matSnackBar.open('No se pudo eliminar la denuncia.')
        );
      }
    });
  }

  changeState(evt: MatSelectChange, denuncia: any) {
    const dto = {denuncia, estado: evt.value};
    this.denunciaService.updateState(dto).subscribe(() => {
      this.matSnackBar.open('Denuncia actualizada correctamente.');
      this.cargarDatos();
    }, error => {
      this.matSnackBar.open(`Error: ${error[0]}.`);
    });
  }

  state(estado: any) {
    switch (estado) {
      case 'Pendiente': {
        return 'pe';
      }
      case 'En proceso': {
        return 'ep';
      }
      case 'No procede': {
        return 'np';
      }
      case 'Procesada': {
        return 'pr';
      }
    }
    return null
  }

  private listenPaginator() {
    this.paginator.page.subscribe(data => {
      this.filters.page = data.pageIndex + 1;
      this.filters.page_size = data.pageSize;
      this.cargarDatos();
    });
  }
}
