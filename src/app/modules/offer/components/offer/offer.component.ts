import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';

import { debounceTime, distinctUntilChanged, finalize, shareReplay } from 'rxjs/operators';
import { OfferService } from '../../../../services/offer.service';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
  offers: any;
  displayedColumns: string[] = ['nombre', 'descripcion', 'price', 'date', 'operations'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  params = {
    offset: 0,
    limit: 10,
  };
  total: number;
  paramsForm: UntypedFormGroup;
  loading = true;

  constructor(
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public authService: AuthService,
    private fb: UntypedFormBuilder
  ) {
  }

  ngOnInit() {
    // this.initParamsForm();
    this.load();
  }

  load() {
    this.loading = true;
    this.offerService.getByParams(this.params)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: any) => {
        this.offers = data.results;
        this.total = data.count;
      });
  }

  eliminar(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta oferta?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offerService.delete(id).subscribe(
          () => {
            this.snackBar.open('Oferta eliminada correctamente.');
            this.load();
          },
          () => this.snackBar.open('No se pudo eliminar la oferta.')
        );
      }
    });
  }

  paginate($event: PageEvent) {
    this.params.offset = $event.pageIndex * $event.pageSize;
    this.params.limit = $event.pageSize;
    this.total = $event.length;
    this.load();
  }

  private initParamsForm() {
    this.paramsForm = this.fb.group({
      serie_nombre__wildcard: ['']
    });
    this.paramsForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay()
    ).subscribe(value => {
      // this.params.serie_nombre__wildcard = value.serie_nombre__wildcard ? '*' + value.serie_nombre__wildcard + '*' : '';
      this.load();
    });
  }

}
