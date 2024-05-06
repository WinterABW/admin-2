import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {SerieService} from '../../../services/serie.service';
import {Router} from '@angular/router';
import {UntypedFormControl} from '@angular/forms';
import {debounceTime, finalize, shareReplay} from 'rxjs/operators';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {SerieBottomSheetComponent} from '../serie-bottom-sheet/serie-bottom-sheet.component';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-serie-list',
  templateUrl: './serie-list.component.html',
  styleUrls: ['./serie-list.component.scss']
})
export class SerieListComponent implements OnInit {
  series: any;
  displayedColumns: string[] = ['nombre', 'cantidad_temporadas', 'cantidad_capitulos', 'ano', 'pais', 'operations'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  params = {
    page: 1,
    page_size: 10,
    nombre__wildcard: ''
  };
  total: number;
  filterControl = new UntypedFormControl('');
  loading = true;

  constructor(
    private serieService: SerieService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.load();
    this.listenFilterControl();
  }

  load() {
    this.loading = true;
    this.serieService.getByParams(this.params)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: any) => {
        this.series = data.results;
        this.total = data.count;
      });
  }

  eliminarSerie(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta serie?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serieService.delete(id).subscribe(
          () => {
            this.snackBar.open('Serie eliminada correctamente.');
            this.load();
          },
          () => this.snackBar.open('No se pudo eliminar la serie.')
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

  edit(id: string) {
    this.router.navigate(['/series/edit/', id]);
  }

  openBottomSheet(serie: any) {
    const ref = this.bottomSheet.open(SerieBottomSheetComponent, {
      data: {
        serie
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminarSerie(serie.pelser_id);
      }
    });
  }

  private listenFilterControl() {
    this.filterControl.valueChanges.pipe(
      debounceTime(400),
      shareReplay()
    ).subscribe(value => {
      this.params.nombre__wildcard = `*${value}*`;
      this.load();
    });
  }
}
