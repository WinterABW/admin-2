import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { CanalService } from 'src/app/services/canal.service';
import { Canal } from 'src/app/models/canal';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { PictaResponse } from '../../../../models/response.picta.model';
import { SubscriptionService } from '../../../../services/subscription.service';
import { CanalSubscriptionsDialogComponent } from '../canal-subscriptions-dialog/canal-subscriptions-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CanalBottomsheetComponent } from '../canal-bottomsheet/canal-bottomsheet.component';
import { DetailsCanalComponent } from '../details-canal/details-canal.component';
import { HotToastService } from '@ngneat/hot-toast';
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Observable } from "rxjs";
import { Plan } from 'src/app/models/plan.model';
import { PlanService } from 'src/app/services/plan.service';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { Response } from 'src/app/models/response';

@Component({
  selector: 'app-canal-list',
  templateUrl: './canal-list.component.html',
  styleUrls: ['./canal-list.component.css']
})
export class CanalListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) matPaginator;
  @ViewChild(MatSort) sort: MatSort;

  canales: any[];
  displayedColumns: string[] = [
    'url_avatar',
    'nombre',
    'fecha_creacion',
    'usuarios_asociados',
    'cantidad_suscripciones',
    'publicado',
    'donate',
    'operaciones'
  ];
  totalCount: any;
  filters: UntypedFormGroup;
  loading = true;
  planes$: Observable<Plan[]>;

  constructor(
    private canalservice: CanalService,
    private dialog: MatDialog,
    private toastService: HotToastService,
    private fb: UntypedFormBuilder,
    public authService: AuthService,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private planService: PlanService,
    private bottomSheet: MatBottomSheet
  ) {
    this.planes$ = this.planService.get({
      skipWrite: true,
      mapResponseFn: (response) => response.results
    });
    this.createFiltersForm();
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loading = true;
    const filters = this.filters.value;
    if (filters.publicado === 'all') {
      delete filters.publicado;
    }
    this.canalservice.getAll(filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: Response<Canal>) => {
        this.canales = data.results;
        this.matPaginator.length = data.count;
        this.totalCount = data.count;
      });
  }

  eliminarCanal(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este canal?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.canalservice.delete(id)
          .pipe(
            this.toastService.observe({
              loading: 'Eliminando Canal',
              success: 'Canal eliminado correctamente',
              error: 'No se pudo eliminar el canal'
            })
          )
          .subscribe(
            () => {
              this.getList();

            }
          );
      }
    });
  }

  publicar(param: { id: any; publicado: any }) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: `¿Está seguro que desea ${param.publicado ? 'publicar' : 'despublicar'
          } este canal?`
      }
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.canalservice.setStatus(param.id, param.publicado)
            .pipe(
              this.toastService.observe({
                loading: 'Actualizando canal',
                success: 'Canal actualizado correctamente',
                error: `No se pudo ${param.publicado ? 'publicar' : 'despublicar'} el canal.`
              }))
            .subscribe(() => {
              this.getList();
            });
        }
      });
  }

  edit(slug_url: any) {
    this.router.navigate(['/canal/edit', slug_url]);
  }

  sortBy(evt: Sort) {
    if (evt.active) {
      if (evt.direction !== '') {
        this.filters.patchValue({
          ordering: evt.direction === 'asc' ? evt.active : '-' + evt.active
        });

      } else {
        this.filters.patchValue({
          ordering: null
        });
      }
    }
    // this.getList();
  }

  openSubscriptionsDialog({ id }) {
    this.subscriptionService.getAll({ canal_id: id }).subscribe((response: PictaResponse<any>) => {
      const { results, count, next } = response;
      this.dialog.open(CanalSubscriptionsDialogComponent, {
        maxHeight: '80vh', data: {
          subscriptions: results,
          total: count,
          next
        }
      });

    });
  }

  openBottomSheet(canal: any) {
    const ref = this.bottomSheet.open(CanalBottomsheetComponent, {
      data: {
        canal
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminarCanal(canal.id);
      }
      if (result === 'details') {
        this.detailsCanal(canal);
      }
      if (result === 'toggle-visibility') {
        this.publicar(canal);
      }
    });
  }

  paginate(data) {
    this.filters.patchValue({
      page_size: data.pageSize,
      page: data.pageIndex + 1,
    });
    /*this.params.page = ;
    this.params.page_size = data.pageSize;
    this.getList();*/
  }

  private detailsCanal(canal) {
    this.dialog.open(DetailsCanalComponent, {
      minWidth: '95vw',
      // minHeight: '100vh',
      data: {
        canal
      }
    });
  }

  private createFiltersForm() {
    this.filters = this.fb.group({
      nombre__contains: '',
      publicado: 'all',
      plan_id: '',
      page_size: 10,
      page: 1,
      ordering: '-fecha_creacion'
    });
    this.filters.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.getList())
      ).subscribe();
  }

  toggleDonate(element, { source, checked }: MatSlideToggleChange) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: `¿Está seguro que desea ${checked ? 'habilitar' : 'deshabilitar'} la premiación de este canal?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.canalservice.update(element.id, { donar: checked })
          .pipe(
            this.toastService.observe({
              loading: 'Actualizando Canal',
              success: 'Canal actualizado correctamente',
              error: 'No se pudo actualizar el canal'
            }))
          .subscribe();
      } else {
        source.checked = !checked;
      }
    });

  }
}
