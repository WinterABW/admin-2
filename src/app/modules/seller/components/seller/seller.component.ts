import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Canal } from '../../../../models/canal';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Response } from '../../../../models/response';

import { SellerService } from '../../../../services/seller.service';
import { SellerBottomsheetComponent } from '../seller-bottomsheet/seller-bottomsheet.component';
import { DetailsSellerComponent } from '../details-seller/details-seller.component';
import { merge, Observable, Subject } from 'rxjs';
import { finalize, map, startWith, switchMap } from 'rxjs/operators';

import { format } from 'date-fns/format';
import { addDays } from 'date-fns';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) matPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datasource = new MatTableDataSource([]);
  filtersFormControl: UntypedFormControl;
  searchControl: UntypedFormControl;
  sellers: any[];
  publicado: boolean;
  lista: boolean;

  salesFilters: UntypedFormGroup;

  params: any = {
    limit: 10,
    offset: 0,
  };

  displayedColumns: string[] = ['ci', 'type', 'joined', 'address', 'account', 'active', 'operaciones'];

  selection = new SelectionModel<Canal>(true, []);
  totalCount: any;
  sellers$: Observable<any>;
  filters: UntypedFormGroup;
  reload = new Subject();
  loading = true;

  constructor(
    private sellerService: SellerService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public authService: AuthService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private paymentService: PaymentService,
  ) {
    this.filtersFormControl = new UntypedFormControl('all');
    this.searchControl = new UntypedFormControl('');
  }

  createForm() {
    this.filters = this.fb.group({
      type__iexact: ['all'],
      active: ['all'],
      name__icontains: [''],
      ci__icontains: [''],
      account__icontains: [''],
      email__icontains: [''],
    });
  };

  ngOnInit() {
    this.createForm();

    this.sellers$ = merge(this.matPaginator.page, this.reload, this.filters.valueChanges)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.params.limit = this.matPaginator.pageSize;
          this.params.offset = this.matPaginator.pageIndex * this.matPaginator.pageSize;
          return this.getList();
        })
      );
    // this.getList();
  }

  getList() {
    this.loading = true;
    const filters = this.filters.value;
    if (filters?.type__iexact === 'all') {
      delete filters.type__iexact;
    }
    if (filters?.active === 'all') {
      delete filters.active;
    }
    return this.sellerService.getAll({ ...this.params, ...filters }).pipe(
      map(
        (data: Response<any>) => {
          this.matPaginator.length = data.count;
          this.totalCount = data.count;
          return data.results;
        }
      ),
      finalize(() => this.loading = false)
    );
  }

  filtrar($event: any) {
    this.params.page = 1;
    this.matPaginator.pageIndex = 0;
    switch ($event) {
      case 'all': {
        delete this.params.publicado;
        break;
      }
      case 'true': {
        this.params.publicado = true;
        break;
      }

      case 'false': {
        this.params.publicado = false;
        break;
      }
    }
    this.getList();
  }

  eliminarCanal(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este vendedor?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sellerService.delete(id).subscribe(
          () => {
            this.matSnackBar.open('Vendedor eliminado correctamente.');
            this.getList();

          },
          () => this.matSnackBar.open('No se pudo eliminar el vendedor.')
        );
      }
    });
  }


  edit(slug_url: any) {
    this.router.navigate(['/canal-edit', slug_url]);
  }

  sortBy(evt: Sort) {
    if (evt.active) {
      if (evt.direction !== '') {
        this.params = { ...this.params, ordering: evt.direction === 'asc' ? evt.active : '-' + evt.active };

      } else {
        delete this.params.ordering;
      }
    }
    this.getList();
  }

  openBottomSheet(seller: any) {
    const ref = this.bottomSheet.open(SellerBottomsheetComponent, {
      data: {
        seller
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminarCanal(seller.id);
      }
      if (result === 'details') {
        this.detailsSeller(seller);
      }
      if (result === 'toggle-visibility') {
        this.toggleActive({ checked: !seller.active }, seller);
      }
    });
  }

  paginate(data) {
    this.params.offset = data.pageIndex + data.pageSize;
    this.params.limit = data.pageSize;
    this.getList();
  }

  toggleActive(event: any, obj: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea ' + (event.source.checked ? 'activar' : 'desactivar') + ' este vendedor?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sellerService.update({ active: event.source.checked }, obj.id).subscribe(
          () => {
            this.matSnackBar.open('Vendedor actualizado correctamente.');
            this.getList();
          },
          (err) => {
            this.matSnackBar.open('No se pudo actualizar el vendedor.');
            this.getList();
          }
        );
      } else {
        event.source.checked = obj.active;
      }
    });
  }

  private detailsSeller(seller) {
    this.dialog.open(DetailsSellerComponent, {
      minWidth: '95vw',
      // minHeight: '100vh',
      data: {
        seller
      }
    });
  }

  exportTable() {
    const filters = this.filters.value;

    if (filters.date__gte) {
      try {
        filters.date__gte = format(filters.date__gte, 'yyyy-MM-dd');
      } catch (e) {
        console.log(e)
      }
    } else {
      delete filters.date__gte;
    }

    if (filters.date__lt) {
      try {
        filters.date__lt = format(addDays(filters.date__lt, 1), 'yyyy-MM-dd');
      } catch (e) {
        console.log(e)
      }
    } else {
      delete filters.date__lt;
    }

    /*
       if (!filters.item_external_id) {
         delete filters.item_external_id;
       }
   
       if (filters.type === 'all') {
         delete filters.type;
       }
   
       if (!filters.channel_id) {
         delete filters.channel_id;
       }
   
       if (this.selectedPublication) {
         filters.item_external_id = `publicacion_${this.pubsControl.get('type_pub').value}_${this.selectedPublication?.id}`;
   
       } else {
         delete filters.external_id;
         filters.external_id__contains = `publicacion_${this.pubsControl.get('type_pub').value}`;
       } */

    this.paymentService.exportExcel_vendedores(filters).subscribe((response: any) => {
      console.log(response);
      const dataType = response.type;
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType.toString() }));
      downloadLink.setAttribute('download', `Picta - Reporte de Vendedores (${format(new Date(), 'dd-MM-yyyy')}).xlsx`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });

  }
}
