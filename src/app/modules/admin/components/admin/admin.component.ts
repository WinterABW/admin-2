import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
// @ts-ignore
import {MatPaginator} from '@angular/material/paginator';
// @ts-ignore
import {MatSnackBar} from '@angular/material/snack-bar';
import {Sort} from '@angular/material/sort';
// @ts-ignore
import {MatTable, MatTableDataSource} from '@angular/material/table';

import {format, parseISO} from 'date-fns';
import {es} from 'date-fns/locale';
import {Section} from '../../../../models/section.model';
import {FiltroService} from '../../../../services/filtro.service';
import {SectionService} from '../../../../services/section.service';
import {EstiloService} from '../../../../services/estilo.service';
import {NotificationService} from '../../../../services/notification.service';


import {debounceTime, distinctUntilChanged, map, pluck} from 'rxjs/operators';
import {PictaResponse} from '../../../../models/response.picta.model';

import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { PublicationService } from 'src/app/services/publication.service';
import { CanalService } from 'src/app/services/canal.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: []
})
export class AdminComponent implements OnInit {
  seccionForm: UntypedFormGroup;
  filtroForm: UntypedFormGroup;
  filtros;
  secciones: Section[];
  displayedColumns: string[] = ['id', 'key', 'value', 'actions'];
  seccionsDisplayedColumns: string[] = ['id', 'prioridad', 'nombre', 'estilo', 'fecha_ini', 'fecha_fin', 'activo', 'actions'];
  filtrosDataSource = new MatTableDataSource<any>();
  seccionsDataSource = new MatTableDataSource<any>();
  @ViewChild('tableFiltros', {static: true}) tableFiltros: MatTable<any>;
  @ViewChild('tableSections', {static: true}) tableSections: MatTable<any>;
  @ViewChild('matPaginatorFiltrosTable', {static: true}) matPaginatorFiltrosTable: MatPaginator;
  @ViewChild('matPaginatorSectionsTable', {static: true}) matPaginatorSectionsTable: MatPaginator;
  styles;
  mode = 'add';
  modeFiltro = 'add';
  canales$: any;
  pubList: any;
  filteredPubs: any;
  extra: { ordering: string };
  filtersSection: any = {
    page: 1,
    page_size: 10
  };
  filtersFiltros = {
    page: 1,
    page_size: 10
  };
  filtrosSelect$;
  seccionFilters: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,
              private filtroService: FiltroService,
              private sectionService: SectionService,
              private notificationService: NotificationService,
              private styleService: EstiloService,
              private matSnackBar: MatSnackBar,
              private dialog: MatDialog,
              private canalService: CanalService,
              private pubService: PublicationService
  ) {
    this.filtroForm = this.fb.group({
      id: [''],
      key: ['canal_nombre_raw', [Validators.required]],
      value: ['', [Validators.required]]
    });

    this.seccionForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      fecha_ini: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      estilo: ['', [Validators.required]],
      prioridad: ['', [Validators.required]],
      filtros: ['', [Validators.required]],
    });
    this.seccionFilters = this.fb.group({
      nombre__wildcard: ['', []]
    });
  }

  ngOnInit() {
    this.loadCanales();
    this.loadStyles();
    this.loadPublicaciones();
    this.getFiltros();
    this.getSecciones();
    this.listenPaginators();
    this.listenSeccionFilters();
  }

  loadCanales() {
    this.canales$ = this.canalService.getA({page_size: 300});
  }

  addFilter() {
    if (this.modeFiltro === 'add') {
      const value = this.filtroForm.value;
      if (value.key === 'id__in') {
        value.value = value.value.reduce((asd, item, i) => {
          return i === 0 ? item + '' : asd + '__' + item;
        }, '');
      }

      this.filtroService.addFiltro(value).subscribe((res) => {
        this.filtros.push(res);
        this.tableFiltros.renderRows();
        this.matSnackBar.open('Filtro adicionado correctamente');
        this.getFiltros();

      }, () => this.matSnackBar.open('Error al adicionar el filtro'));
    } else {
      const value = this.filtroForm.value;
      if (value.key === 'id__in') {
        value.value = value.value.reduce((asd, item, i) => {
          return i === 0 ? item + '' : asd + '__' + item;
        }, '');
      }
      this.filtroService.editSection(this.filtroForm.get('id').value, value).subscribe((updated: any) => {
        this.filtros.forEach((item: any, index: number) => {
          if (item.id === updated.id) {
            this.filtros[index] = updated;
          }
        });
        this.tableFiltros.renderRows();
        this.matSnackBar.open('Filtro actualizado correctamente');


      });
      this.filtroForm.reset();
      this.modeFiltro = 'add';
    }

  }

  addSeccion() {
    if (this.mode === 'add') {
      const data = this.seccionForm.value;
      data.fecha_ini = format(data.fecha_ini, 'yyyy-MM-dd\'T\'HH:mm', {locale: es});
      data.fecha_fin = format(data.fecha_fin, 'yyyy-MM-dd\'T\'HH:mm', {locale: es});
      this.sectionService.addSeccion(data).subscribe((res: Section) => {
          this.secciones.push(res);
          this.seccionsDataSource.data = this.secciones;
          this.tableSections.renderRows();
          this.matSnackBar.open('Sección adicionada correctamente');
          this.seccionForm.reset();

        }, () => this.matSnackBar.open('Error al adicionar la sección')
      );
    } else {
      const dirtyValues: any = this.getDirtyValues(this.seccionForm);
      if (dirtyValues.fecha_ini) {
        dirtyValues.fecha_ini = format(dirtyValues.fecha_ini, 'yyyy-MM-dd\'T\'HH:mm', {locale: es});
      }
      if (dirtyValues.fecha_fin) {
        dirtyValues.fecha_fin = format(dirtyValues.fecha_fin, 'yyyy-MM-dd\'T\'HH:mm', {locale: es});
      }
      this.sectionService.editSection(this.seccionForm.get('id').value, dirtyValues).subscribe(() => {
        this.matSnackBar.open('Sección actualizada correctamente');
        this.seccionForm.reset();
        this.mode = 'add';
      });
    }

  }

  getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });

    return dirtyValues;
  }

  deleteSection(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta sección?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sectionService.deleteSeccion(id).subscribe(res => {
            this.secciones = this.secciones.filter((item) => item.id !== id);
            this.seccionsDataSource.data = this.secciones;
            this.tableSections.renderRows();
            this.matSnackBar.open('Sección eliminada correctamente.');


          }, error1 => this.matSnackBar.open('Error al eliminar la sección')
        );
      }
    });

  }

  deleteFilter(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Estás seguro que deseas eliminar este filtro?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filtroService.deleteFilter(id).subscribe(res => {
            this.filtros = this.filtros.filter((item) => item.id !== id);
            this.filtrosDataSource.data = this.filtros;
            this.tableFiltros.renderRows();
            this.matSnackBar.open('Filtro eliminado correctamente.');


          }, error1 => this.matSnackBar.open('Error al eliminar el filtro')
        );
      }
    });
  }

  getDate(fecha: string) {
    return format(parseISO(fecha), 'yyyy-MM-dd', {locale: es});
  }

  edit(element: Section) {
    this.seccionForm.patchValue({...element, estilo: element.estilo === 'banner' ? 2 : 1});
    this.mode = 'edit';
  }

  editFiltro(element: any) {
    if (element.key === 'id__in') {
      element.value = element.value.split('__').map(s => Number(s));
    }
    this.filtroForm.patchValue(element);
    this.modeFiltro = 'edit';

  }

  loadPublicaciones() {
    this.pubService.getAll().subscribe((pubs: any) => {
      this.pubList = pubs.results;
      this.filteredPubs = this.pubList;
    });
  }

  searchPub($event: { term: string; items: any[] }) {
    const {term} = $event;
    if (term) {
      this.pubService.getAll({nombre__wildcard: term + '*'}).subscribe((pubs: any) => {
        this.filteredPubs = pubs.results;
      });
    } else {
      this.filteredPubs = this.pubList;
    }
  }

  sortTable(evt: Sort) {
    if (evt.active) {
      if (evt.direction !== '') {
        this.extra = {ordering: evt.direction === 'asc' ? evt.active : '-' + evt.active};

      } else {
        delete this.extra.ordering;
      }
    }
    this.getSecciones();
  }

  upPosition({id, prioridad}) {
    this.sectionService.editSection(id, {prioridad: prioridad + 1}).subscribe(() => {
      this.getSecciones();
    });
  }

  downPosition({id, prioridad}) {
    this.sectionService.editSection(id, {prioridad: prioridad - 1}).subscribe(() => {
      this.getSecciones();
    });
  }

  toggleActive(element: any) {
    this.sectionService.editSection(element.id, {activo: !element.activo}).subscribe(() => {
      this.getSecciones();
      this.matSnackBar.open('Sección editada correctamente');
    });
  }

  private loadStyles() {
    this.styles = this.styleService.getAll();
  }

  private getFiltros() {
    this.filtrosSelect$ = this.filtroService.getAll().pipe(pluck('results'));
    this.filtroService.getAll(this.filtersFiltros).subscribe((data: any) => {
      this.filtros = data.results;
      this.matPaginatorFiltrosTable.length = data.count;
    });

  }

  private getSecciones() {
    this.sectionService.getSeccionesAdmin({...this.filtersSection, ...this.extra}).subscribe((res: PictaResponse<Section>) => {
      this.secciones = res.results;
      this.matPaginatorSectionsTable.length = res.count;
    });

  }

  private listenPaginators() {
    this.matPaginatorSectionsTable.page.subscribe(value => {
      this.filtersSection.page = value.pageIndex + 1;
      this.filtersSection.page_size = value.pageSize;
      this.getSecciones();
    });
    this.matPaginatorFiltrosTable.page.subscribe(value => {
      this.filtersFiltros.page = value.pageIndex + 1;
      this.filtersFiltros.page_size = value.pageSize;
      this.getFiltros();
    });
  }

  private listenSeccionFilters() {
    this.seccionFilters.valueChanges.
    pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(({ nombre__wildcard }) => nombre__wildcard + '*')
    ).subscribe( (nombre__wildcard)  => {
      if (nombre__wildcard){
        this.filtersSection = { ... this.filtersSection, nombre__wildcard};
        this.getSecciones();
      } else {
        delete this.filtersSection.nombre__wildcard;
      }
    });
  }
}
