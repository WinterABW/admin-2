import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {TemporadaService} from '../../../services/temporada.service';
import {AuthService} from '../../../services/auth.service';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, finalize, shareReplay} from 'rxjs/operators';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {TemporadaBottomSheetComponent} from '../temporada-bottom-sheet/temporada-bottom-sheet.component';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-temporada-list',
  templateUrl: './temporada-list.component.html',
  styleUrls: ['./temporada-list.component.scss']
})
export class TemporadaListComponent implements OnInit {

  temporadas: any;
  displayedColumns: string[] = ['nombre', 'cantidad_capitulos', 'serie', 'canal', 'operations'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  params = {
    page: 1,
    page_size: 10,
    serie_nombre__wildcard: ''
  };
  total: number;
  tempParamsForm: UntypedFormGroup;
  loading = true;

  constructor(
    private temporadaService: TemporadaService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    public authService: AuthService,
    private fb: UntypedFormBuilder
  ) {
  }

  ngOnInit() {
    this.initParamsForm();
    this.load();
  }

  load() {
    this.loading = true;
    this.temporadaService.getByParams(this.params)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: any) => {
        this.temporadas = data.results;
        this.total = data.count;
      });
  }

  eliminar(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta temporada?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.temporadaService.delete(id).subscribe(
          () => {
            this.snackBar.open('Temporada eliminada correctamente.');
            this.load();
          },
          () => this.snackBar.open('No se pudo eliminar la temporada.')
        );
      }
    });
  }

  paginate($event: PageEvent) {
    this.params.page = $event.pageIndex + 1;
    this.params.page_size = $event.pageSize;
    this.total = $event.length;
    this.load();
  }

  openBottomSheet(temporada: any) {
    const ref = this.bottomSheet.open(TemporadaBottomSheetComponent, {
      data: {
        temporada
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminar(temporada.id);
      }
    });
  }

  private initParamsForm() {
    this.tempParamsForm = this.fb.group({
      serie_nombre__wildcard: ['']
    });
    this.tempParamsForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay()
    ).subscribe(value => {
      this.params.serie_nombre__wildcard = value.serie_nombre__wildcard ? '*' + value.serie_nombre__wildcard + '*' : '';
      this.load();
    });
  }
}
