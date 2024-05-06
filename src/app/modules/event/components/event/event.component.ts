import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {EventService} from '../../services/event.service';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Evento} from '../../models/event';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

import {UsersDialogComponent} from '../users-dialog/users-dialog.component';
import {EventoService} from '../../state/evento.service';
import {EventoQuery} from '../../state/evento.query';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {HotToastService} from '@ngneat/hot-toast';

import {environment} from '../../../../../environments/environment';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

const baseUrlv2=environment.baseUrlv2
const url=`${baseUrlv2}/evento/`
console.log(url);

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  displayedColumns = ['id', 'name', 'users', 'operations'];
  refresh = new Subject();
  eventos: Evento[];
  @ViewChild('matPaginator') paginator: any;
  loading = true;
  eventos$ = this.eventoQuery.selectAll();
  filterForm: UntypedFormGroup;

  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private fb: UntypedFormBuilder,
    private eventoService: EventoService,
    private eventoQuery: EventoQuery,
    private toastService: HotToastService,
  ) {
    this.filterForm = this.fb.group({
      page: 1,
      page_size: 10
    });
    this.filterForm.valueChanges.subscribe(() => this.loadData());
  }

  ngOnInit(): void {
    this.loadData();
  }

  delete(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este evento?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventoService.delete(id)
          .pipe(
            this.toastService.observe({
              loading: 'Eliminando Evento',
              success: 'Evento eliminado correctamente',
              error: 'No se pudo eliminar el evento'
            }),
            tap(x => {
              this.paginator.length -= 1;
            }),
            catchError(err => {
              throw err;
            })
          )
          .subscribe();
      }
    });

  }

  loadData() {
    const params = this.filterForm.value;
    this.loading = true;
    this.eventoService.get({
      url: url,
      params,
      mapResponseFn: (response => {
        this.paginator.length = response.count;
        return response.results;
      })
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe();
  }

  openUsersDialog(element) {
    const evento = (JSON.parse(JSON.stringify(element)));
    this.dialog.open(UsersDialogComponent, {
      width: '400px',
      data: {
        evento
      }
    });
  }

  paginate({length, pageSize, pageIndex}: PageEvent) {
    this.filterForm.patchValue({
      page: pageIndex + 1,
      page_size: pageSize
    });
  }
}
