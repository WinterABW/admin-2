import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, finalize, tap} from 'rxjs/operators';
import {ApiNotification} from '../../../../models/api-notification';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {NotificationService} from '../../../../services/notification.service';
import {NotificationQuery} from '../../state/notification.query';
import {HotToastService} from '@ngneat/hot-toast';
import {NgEntityServiceLoader} from '@datorama/akita-ng-entity-service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

const baseUrl=environment.baseUrl

@Component({
  selector: 'app-api-notifications',
  templateUrl: './api-notifications.component.html',
  styleUrls: ['./api-notifications.component.scss']
})
export class ApiNotificationsComponent implements OnInit {

  datasource = new MatTableDataSource();
  displayedColumns = ['id', 'date', 'users', 'msg', 'operations'];
  refresh = new Subject();
  apiNotifications: ApiNotification[];
  apiNotifications$ = this.notificationQuery.selectAll();
  @ViewChild('matPaginator') paginator: MatPaginator;
  loading = true;
  loading$ = this.notificationQuery.selectLoading();
  filters: UntypedFormGroup;
  totalCount: number;
  loaders = this.loader.loadersFor('notification');
  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private notificationQuery: NotificationQuery,
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
        msg: '¿Está seguro que desea eliminar esta notificación?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.delete( id, {
          url: baseUrl + '/notificacion/' + id,

        }).pipe(
          tap(x => {
            // this.loadData();
            this.toast.success('Notificación eliminada correctamente');
          }),
          catchError(err => {
            this.toast.error('Error al eliminar la notificación');
            throw err;
          })
        ).subscribe();
      }
    });

  }

  loadData() {
    this.loading = true;
    const filters = this.filters.value;

    this.notificationService.get({
      // url: baseUrlv2 + '/notificacion/',
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
        // this.apiNotifications = response.results;
        // this.datasource.data = this.apiNotifications;
        // this.paginator.length = response.count;
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
      tipo: 'notificacion_api',
      ordering: '-fecha_creacion',
      page: 1,
      page_size: 10
    });
    this.filters.valueChanges.subscribe(() => {
      this.loadData();
    });
  }
}
