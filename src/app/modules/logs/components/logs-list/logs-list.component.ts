import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LogsService } from '../../../../services/logs.service';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})
export class LogsListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) matPaginator;
  @ViewChild(MatSort) sort: MatSort;

  logs: any[];

  displayedColumns: string[] = [
    'id',
    'accion',
    'usuario',
    'url',
    'ip',
    'fecha',
    'datos',
    'modelo',
  ];
  totalCount: any;
  filters: UntypedFormGroup;
  loading = true;


  constructor(
    private logsservice: LogsService,
    private fb: UntypedFormBuilder,
  ) {
    this.createFiltersForm();
  }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.loading = true;
    const filters = this.filters.value;
    if (filters.accion === 'All') {
      delete filters.publicado;
    }
    this.logsservice.getAll(filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: any) => {
        this.logs = data.results;
        this.matPaginator.length = data.count;
        this.totalCount = data.count;
      });
  }

  paginate(data) {
    this.filters.patchValue({
      page_size: data.pageSize,
      page: data.pageIndex + 1,
    });
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

  private createFiltersForm() {
    this.filters = this.fb.group({
      usuario__contains: '',
      ip__contains: '',
      modelo__contains: '',
      accion: '',
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

}
