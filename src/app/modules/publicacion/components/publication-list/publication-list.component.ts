import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { PublicationCommentsDialogComponent } from '../publication-comments-dialog/publication-comments-dialog.component';
import { PublicationDownloadDialogComponent } from '../publication-download-dialog/publication-download-dialog.component';
import { PublicationReproduccionDialogComponent } from '../publication-reproduccion-dialog/publication-reproduccion-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { PublicationVoteDialogComponent } from '../publication-vote-dialog/publication-vote-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PublicationBottomSheetComponent } from '../publication-bottom-sheet/publication-bottom-sheet.component';
import { DetailsPublicationComponent } from '../details-publication/details-publication.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CanalService } from '../../../../services/canal.service';
import { CommentService } from '../../../comentario/services/comment.service';
import { AuthService } from '../../../../services/auth.service';
import { Publicacion, Tipologia } from '../../../../models/publicacion';
import { PictaResponse } from '../../../../models/response.picta.model';
import { HotToastService } from '@ngneat/hot-toast';
import { PublicationService } from 'src/app/services/publication.service';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { SearchService } from 'src/app/services/search.service';
import { DownloadService } from 'src/app/services/download.service';
import { ReproduccionService } from 'src/app/services/reproduccion.service';
import { VotoService } from 'src/app/services/voto.service';
import { TipologiaService } from 'src/app/services/tipologia.service';

declare const Hammer: any;

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
  animations: [
    trigger('filters', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PublicationListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'url_imagen',
    'estado',
    'fecha_creacion',
    'cantidad_reproducciones',
    'cantidad_descargas',
    'likes',
    'usuario',
    'canal',
    'operaciones',
  ];

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  @ViewChild('matPaginator', { static: true }) matPaginator;
  @ViewChild('table') table: ElementRef;
  publicaciones: any[] = [];
  canales$: Observable<any[]>;
  filters: UntypedFormGroup;
  tipologias: Observable<Tipologia[]>;
  extra: { ordering: string };
  isHanset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((value) => value.matches));
  tableScroll: any;
  totalCount = 0;
  loading = false;

  constructor(
    private pubService: PublicationService,
    private toast: HotToastService,
    private dialog: MatDialog,
    private router: Router,
    private searchService: SearchService,
    private canalService: CanalService,
    private commentService: CommentService,
    private downloadService: DownloadService,
    private reproduccionService: ReproduccionService,
    private votoService: VotoService,
    private fb: UntypedFormBuilder,
    private tipologiaService: TipologiaService,
    private breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.initFilterForm();
    this.canales$ = this.canalService
      .getA({ ordering: 'nombre', page_size: 100 })
      .pipe(map((list) => [{ nombre: 'Ver todos' }, ...list]));
    this.tipologias = this.tipologiaService.getAll();
    this.publicaciones = route.snapshot.data['list'].results;
  }

  get isAdmin() {
    return this.authService.groups.some((g) => g.name === 'Administrador');
  }

  ngOnInit() {
    this.listenPaginator();
    if (!this.publicaciones.length) {
      this.getListByParams();
    }
    this.matPaginator.length = this.route.snapshot.data['list'].count;
    this.totalCount = this.route.snapshot.data['list'].count;
  }

  eliminarPublicacion(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta publicación?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.pubService
          .deletePublication(id)
          .pipe(
            this.toast.observe({
              loading: 'Eliminando publicación',
              success: 'Publicación eliminada correctamente',
              error: `No se pudo eliminar la publicación.`,
            })
          )
          .subscribe(() => {
            this.getListByParams(true);
          });
      }
    });
  }

  publicar(pub: Publicacion) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: `¿Está seguro que desea ${
          !pub.publicado ? 'publicar' : 'ocultar'
        } esta publicación?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (pub.tipo === 'publicacion_en_vivo') {
          this.pubService
            .setStatus(pub.id, !pub.publicado, pub.tipo)
            .pipe(
              this.toast.observe({
                loading: 'Actualizando publicación',
                success: 'Publicación actualizada correctamente',
                error: `No se pudo ${
                  pub.publicado ? 'publicar' : 'despublicar'
                } la publicación.`,
              })
            )
            .subscribe(() => {
              this.getListByParams(true);
            });
        } else {
          this.pubService
            .setStatus(
              pub.id,
              !pub.publicado,
              pub.tipo,
              pub.categoria.tipologia.id
            )
            .pipe(
              this.toast.observe({
                loading: 'Actualizando publicación',
                success: 'Publicación actualizada correctamente',
                error: `No se pudo ${
                  pub.publicado ? 'publicar' : 'despublicar'
                } la publicación.`,
              })
            )
            .subscribe(() => {
              this.getListByParams(true);
            });
        }
      }
    });
  }

  edit(slug: string) {
    this.router.navigate(['/publication-edit', slug]);
  }

  sortBy(evt: Sort) {
    if (evt.active) {
      if (evt.direction !== '') {
        this.extra = {
          ordering: evt.direction === 'asc' ? evt.active : '-' + evt.active,
        };
      } else {
        delete this.extra.ordering;
      }
    }
    this.getListByParams();
  }

  getListByParams(fromPagination = false) {
    this.isLoadingResults = true;
    let filters = this.filters.value;
    if (filters.filtro === 'convertida') {
      filters = { ...filters, convertido: 'false' };
    } else if (filters.filtro === 'lista') {
      filters = { ...filters, convertido: 'true', publicado: 'false' };
    } else if (filters.filtro === 'publicado') {
      filters = { ...filters, publicado: 'true', convertido: 'true' };
    }
    delete filters.filtro;
    if (filters.nombre__wildcard) {
      filters.nombre__wildcard = `${filters.nombre__wildcard}*`;
    }
    if (filters.canal_nombre_raw === 'Ver todos') {
      delete filters.canal_nombre_raw;
    }
    if (!fromPagination) {
      filters.page = 1;
      this.matPaginator.pageIndex = 0;
    }
    this.pubService
      .getAll({ ...filters, ...this.extra })
      .pipe(finalize(() => (this.isLoadingResults = false)))
      .subscribe((resp: any) => {
        this.publicaciones = resp.results;
        this.matPaginator.length = resp.count;
        this.totalCount = resp.count;
      });
  }

  toggleDescargable({ id, descargable, tipo, categoria, url_manifiesto }) {
    const minioID = this.getMinioID(url_manifiesto);

    this.pubService
      .update(id, {
        descargable: !descargable,
        tipo,
        tipologia: categoria.tipologia.id,
      })
      .pipe(
        this.toast.observe({
          loading: 'Actualizando publicación',
          success: 'Publicación actualizada correctamente',
          error: 'No se pudo actualizar la publicación',
        }),
        switchMap(() =>
          !descargable
            ? this.pubService.generarDescargaLocal(minioID)
            : this.pubService.deleteDescarga(minioID)
        )
      )
      .subscribe(() => {
        this.getListByParams(true);
      });
  }

  seeComments({ id }) {
    this.commentService
      .get_comentarios({ publicacion_id: id })
      .subscribe((response: PictaResponse<any>) => {
        const { results, count, next } = response;
        this.dialog.open(PublicationCommentsDialogComponent, {
          maxHeight: '90vh',
          maxWidth: '90vw',
          minWidth: '50vw',
          data: {
            comments: results,
            total: count,
            next,
          },
        });
      });
  }

  seeDownloads({ id }) {
    this.downloadService
      .getAll({ publicacion_id: id })
      .subscribe((response: PictaResponse<any>) => {
        const { results, count, next } = response;
        this.dialog.open(PublicationDownloadDialogComponent, {
          maxHeight: '90vh',
          data: {
            downloads: results,
            total: count,
            next,
          },
        });
      });
  }

  seeViews({ id }) {
    this.reproduccionService
      .getAll({ publicacion_id: id, page_size: 500 })
      .subscribe((response: PictaResponse<any>) => {
        const { results, count, next } = response;
        this.dialog.open(PublicationReproduccionDialogComponent, {
          maxHeight: '90vh',
          data: {
            reproductions: results.filter((view) => view.usuario.username),
            total: count,
            next,
          },
        });
      });
  }

  ngAfterViewInit(): void {
    /*     this.isHanset$.subscribe(value => {
          if (!value) {
            this.setupScrollTable();
          } else {
            if (this.tableScroll) {
              this.tableScroll.destroy();
            }
          }
        }); */
  }

  change(id, tipologia) {
    this.pubService
      .update(id, { convertido: true, tipo: 'publicacion', tipologia })
      .subscribe();
    this.getListByParams(true);
  }

  seeLikes({ id }) {
    this.votoService
      .getAll({ publicacion_id: id, page_size: 500 })
      .subscribe((response: PictaResponse<any>) => {
        const { results, count, next } = response;
        this.dialog.open(PublicationVoteDialogComponent, {
          maxHeight: '90vh',
          data: {
            likes: results.filter((vote) => vote.valor),
            dislikes: results.filter((vote) => !vote.valor),
            total: count,
            next,
          },
        });
      });
  }

  openBottomSheet(publicacion: any) {
    const ref = this.bottomSheet.open(PublicationBottomSheetComponent, {
      data: {
        publicacion,
      },
    });
    ref.afterDismissed().subscribe((result) => {
      if (result === 'delete') {
        this.eliminarPublicacion(publicacion.id);
      }
      if (result === 'details') {
        this.detailsPublicacion(publicacion);
      }
      if (result === 'toggle-visibility') {
        this.publicar(publicacion);
      }
      if (result === 'toggle-download') {
        this.toggleDescargable(publicacion);
      }
      if (result === 'generate-download') {
        this.generateDownload(publicacion.url_manifiesto);
      }
      if (result === 'convert') {
        this.convert(publicacion);
      }
      if (result === 'stop-live') {
        this.stopLive(publicacion);
      }
    });
  }

  paginate(data) {
    this.filters.patchValue(
      { page: data.pageIndex + 1, page_size: data.pageSize },
      { emitEvent: false }
    );
    this.getListByParams(true);
  }

  toggleInternacional({ id, internacional, tipo, categoria }) {
    this.pubService
      .update(id, {
        internacional: !internacional,
        tipo,
        tipologia: categoria.tipologia.id,
      })
      .pipe(
        this.toast.observe({
          loading: 'Actualizando publicación',
          success: 'Publicación actualizada correctamente',
          error: 'No se pudo actualizar la publicación',
        })
      )
      .subscribe(() => {
        this.getListByParams(true);
      });
  }

  generateDownload(url_manifiesto: string) {
    const minioID = this.getMinioID(url_manifiesto);
    this.pubService.generarDescargaLocal(minioID).subscribe(() => {
      this.toast.show('Generando descarga');
    });
  }

  deleteDownload(url_manifiesto: string) {
    const minioID = this.getMinioID(url_manifiesto);
    this.pubService.deleteDescarga(minioID).subscribe(() => {
      this.toast.show('Eliminando descarga');
    });
  }

  convert({ id, url_manifiesto, categoria, tipo, descargable }) {
    const minioID = this.getMinioID(url_manifiesto);
    this.pubService
      .convertirVideo(minioID, descargable)
      .pipe(
        switchMap(() =>
          this.pubService.update(id, {
            convertido: false,
            tipo,
            tipologia: categoria.tipologia.id,
          })
        )
      )
      .subscribe(() => {
        this.toast.show('Conversión iniciada');
        this.getListByParams();
      });
  }

  getMinioID(urlManifiesto) {
    const texts = urlManifiesto.split('/');
    return texts[texts.length - 2];
  }

  stopConvertion({ url_manifiesto }) {
    // this.matSnackBar.open('Coming soon');
    const minioID = this.getMinioID(url_manifiesto);
    this.pubService.stopConvertion(minioID).subscribe(() => {
      this.toast.show('Conversión detenida');
    });
  }

  private initFilterForm() {
    this.filters = this.fb.group({
      filtro: [''],
      tipo__in: [''],
      canal_nombre_raw: ['Ver todos'],
      nombre__wildcard: [''],
      tipologia_nombre_raw: [''],
      page_size: ['10'],
      page: ['1'],
    });
    this.filters.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), shareReplay())
      .subscribe((filters) => {
        this.getListByParams();
      });
  }

  private listenPaginator() {
    this.matPaginator.page.subscribe((data) => {
      this.filters.patchValue(
        { page: data.pageIndex + 1, page_size: data.pageSize },
        { emitEvent: false }
      );
      this.getListByParams(true);
    });
  }

  /*   private setupScrollTable() {
      this.tableScroll = new Hammer(this.table.nativeElement);
      this.tableScroll.get('pan').set({threshold: 100});
      this.tableScroll.on('panleft panright', (ev) => {
        const {scrollLeft} = this.table.nativeElement;
        if (ev.type === 'panleft') {
          this.table.nativeElement.scrollLeft = scrollLeft + ev.distance / 10;
        } else if (ev.type === 'panright') {
          this.table.nativeElement.scrollLeft = scrollLeft - ev.distance / 10;
        }
      });
    } */

  private detailsPublicacion(publicacion) {
    this.dialog.open(DetailsPublicationComponent, {
      minWidth: '95vw',
      // minHeight: '100vh',
      data: {
        publicacion,
      },
    });
  }

  stopLive({ url_manifiesto }) {
    // this.matSnackBar.open('Coming soon');
    const minioID = this.getLiveMinioID(url_manifiesto);
    this.pubService.stopLive(minioID).subscribe(
      () => {
        this.toast.show('Directa detenida');
      },
      (error) => {
        this.toast.error('No se pudo detener la directa');
      }
    );
  }

  getLiveMinioID(urlManifiesto) {
    const texts = urlManifiesto.split('/');
    return texts[texts.length - 1].split('.')[0];
  }
}
