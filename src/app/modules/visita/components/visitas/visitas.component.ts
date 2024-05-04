import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgEntityServiceLoader } from '@datorama/akita-ng-entity-service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { VoteQuery } from "../../state/vote.query";
import { VisitaService } from "../../state/visita.service";
import { Publicacion } from "../../../../models/publicacion";
import { PictaResponse } from "../../../../models/response.picta.model";
import {format} from "date-fns/format";
import { environment } from 'src/environments/environment';
import { PublicationService } from 'src/app/services/publication.service';

const baseUrlv2=environment.baseUrlv2

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit {

  datasource = new MatTableDataSource();
  displayedColumns = ['direccion', 'user', 'date', 'video', 'operations'];
  refresh = new Subject();
  votes = this.voteQuery.selectAll();
  @ViewChild('matPaginator') paginator: MatPaginator;
  loading = true;
  loading$ = this.voteQuery.selectLoading();
  filters: UntypedFormGroup;
  totalCount: number;
  loaders = this.loader.loadersFor('vote');
  pubList: Publicacion[];
  pubsControl = new UntypedFormControl('');

  constructor(
    private voteService: VisitaService,
    private publicationService: PublicationService,
    private voteQuery: VoteQuery,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private loader: NgEntityServiceLoader
  ) {
    this.createFiltersForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const filters = this.filters.value;

    if (filters.fecha__gte) {
      filters.fecha__gte = format(filters.fecha__gte, 'yyyy-MM-dd\'T\'HH:mm:ss');
    } else {
      delete filters.fecha__gte;
    }
    if (filters.fecha__lte) {
      filters.fecha__lte = format(filters.fecha__lte, 'yyyy-MM-dd\'T\'HH:mm:ss');
    } else {
      delete filters.fecha__lte;
    }
    this.voteService.get({
      url: baseUrlv2 + '/visita/',
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
      ordering: '-fecha',
      fecha__gte: '',
      fecha__lte: '',
      valor: '',
      publicacion_id: '',
      page: 1,
      page_size: 10
    });
    this.filters.valueChanges.subscribe(() => {
      this.loadData();
    });
    this.pubsControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay(),
      switchMap(value => value ? this.publicationService.getAll({ nombre__wildcard: value + '*' }) : this.publicationService.getAll())
    ).subscribe((response: PictaResponse<Publicacion>) => {
      this.pubList = response.results;
    });
  }

  loadPublicaciones(term: string) {
    this.publicationService.getAll(term ? { nombre__wildcard: term + '*' } : {}).subscribe((pubs: any) => {
      this.pubList = pubs.results;
    });
  }

  selectPublication(publication: Publicacion) {
    if (publication) {
      this.pubsControl.setValue(publication.nombre || '');
      this.filters.patchValue({ publicacion_id: publication?.id });
    } else {
      this.pubsControl.setValue('');
      this.filters.patchValue({ publicacion_id: `` });
    }
  }

  searchPub($event: { term: string; items: any[] }) {
    const { term } = $event;
    this.pubsControl.setValue(term);
  }
}
