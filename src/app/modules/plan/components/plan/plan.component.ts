import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HotToastService } from '@ngneat/hot-toast';
import { NgEntityServiceLoader } from '@datorama/akita-ng-entity-service';
import { catchError, debounceTime, finalize, tap } from 'rxjs/operators';
import { PlanService } from '../../../../services/plan.service';
import { PlanQuery } from '../../state/plan.query';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

const baseUrlv2 = environment.baseUrlv2

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  datasource = new MatTableDataSource();
  displayedColumns = ['nombre', 'alias', 'descripcion', 'precio', 'date', 'operations'];
  refresh = new Subject();
  plans = this.planQuery.selectAll();
  @ViewChild('matPaginator') paginator: MatPaginator;
  loading = true;
  loading$ = this.planQuery.selectLoading();
  filters: UntypedFormGroup;
  totalCount: number;
  loaders = this.loader.loadersFor('plan');
  constructor(
    private dialog: MatDialog,
    private planService: PlanService,
    private planQuery: PlanQuery,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private toast: HotToastService,
    private loader: NgEntityServiceLoader
  ) {
    this.createFiltersForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  delete(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este plan?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.planService.delete(id).pipe(
          tap(x => {
            // this.loadData();
            this.toast.success('Plan eliminado correctamente');
          }),
          catchError(err => {
            this.toast.error('Error al eliminar el plan');
            throw err;
          })
        ).subscribe();
      }
    });

  }

  loadData() {
    this.loading = true;
    const filters = this.filters.value;

    this.planService.get({
      url: baseUrlv2 + '/plan/',
      params: filters,
      mapResponseFn: (res) => {
        this.totalCount = res.count;
        return res.results;
      }
    })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
      });
  }

  paginate($event: PageEvent) {
    this.filters.patchValue({
      page: $event.pageIndex + 1,
      page_size: $event.pageSize
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message);
  }

  private createFiltersForm() {
    this.filters = this.fb.group({
      nombre__icontains: '',
      descripcion__icontains: '',
      precio__exact: '',
      alias__icontains: '',
      page: 1,
      page_size: 10
    });
    this.filters.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(() => {
        this.loadData();
      });
  }
}
