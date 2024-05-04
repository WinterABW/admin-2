import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {GeneroTableDataSource, GeneroTableItem} from './genero-table-datasource';

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GeneroFormComponent} from '../genero-form/genero-form.component';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { GeneroService } from 'src/app/services/genero.service';

@Component({
  selector: 'app-genero-table',
  templateUrl: './genero-table.component.html',
  styleUrls: ['./genero-table.component.scss']
})
export class GeneroTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<GeneroTableItem>;
  dataSource: GeneroTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nombre', 'tipo', 'actions'];
  params: any;

  constructor(
    private generoService: GeneroService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.dataSource = new GeneroTableDataSource(this.generoService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.loadData();
    this.dataSource.listenPaginate();
  }

  openAddForm() {
    const dialogRef = this.dialog.open(GeneroFormComponent, {
      data: {operation: 'ADD'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generoService.create(result).subscribe(() => {
          this.snackBar.open('Género adicionado correctamente');
          this.loadData();
        });
      }
    });
  }

  public loadData(params = {}) {
    this.dataSource.loadData(params);
  }

  delete({id}) {
    const dialog = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          msg: '¿Estás seguro que deseas eliminar este género?'
        }
      });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.generoService.delete(id).subscribe(() => {
          this.snackBar.open('Género eliminado correctamente');
          this.dataSource.loadData();
        });
      }
    });
  }

  edit(genero) {
    const dialogRef = this.dialog.open(GeneroFormComponent, {
      data: {
        operation: 'EDIT',
        genero
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generoService.update(result).subscribe(() => {
          this.snackBar.open('Género actualizado correctamente');
          this.loadData();
        });
      }
    });
  }
}
