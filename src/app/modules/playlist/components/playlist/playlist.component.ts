import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlaylistService} from '../../services/playlist.service';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {PlaylistNewComponent} from '../playlist-new/playlist-new.component';
import {MatPaginator} from '@angular/material/paginator';
import {PlaylistEditComponent} from '../playlist-edit/playlist-edit.component';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {PlaylistBottomSheetComponent} from '../playlist-bottom-sheet/playlist-bottom-sheet.component';
import {finalize} from 'rxjs/operators';
import {HotToastService} from '@ngneat/hot-toast';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, AfterViewInit {
  playlists: any[] = [];
  filters = {
    page: 2,
    page_size: 10
  };
  canales: any[] = [];
  displayedColumns: string[] = [
    'nombre',
    'fecha',
    'tiempo_creacion',
    'canal',
    'operaciones'
  ];
  @ViewChild(MatPaginator, {static: true}) matPaginator;
  filtersForm: UntypedFormGroup;
  total: any;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private matDialog: MatDialog,
    private matSnackBar: HotToastService,
    private bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    this.playlists = this.route.snapshot.data['playlists'].results;
    this.canales = this.route.snapshot.data['canales'];
  }

  ngOnInit() {
    this.filtersForm = this.fb.group({
      canal_nombre_raw: [''],
      nombre__wildcard: [''],
    });
    this.filtersForm.valueChanges.subscribe(() => {
      this.filters.page = 1;
      this.loadData();
    });
    this.listenPaginator();
  }


  add() {
    const dialog = this.matDialog.open(PlaylistNewComponent, {
      data: {
        canales: this.canales
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.matSnackBar.success('Lista creada correctamente');
        this.filters.page = 1;
        this.loadData();
      }
    });
  }

  sortBy($event: Sort) {

  }

  async edit(playlist: any) {
    const dialog = this.matDialog.open(PlaylistEditComponent, {
      /*minHeight: '80vh',
      maxWidth: '80vw',*/
      data: {
        canales: this.canales,
        playlist,
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.matSnackBar.success('Lista editada correctamente');
        this.filters.page = 1;
        this.loadData();
      }
    });
  }

  eliminar(id: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta lista?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playlistService.delete(id)
          .pipe(
            this.matSnackBar.observe({
              loading: 'Eliminando lista',
              success: 'Lista eliminada correctamente',
              error: 'No se pudo eliminar la lista'
            })
          )
          .subscribe(
            () => {
              this.filters.page = 1;
              this.loadData();
            }
          );
      }
    });
  }

  ngAfterViewInit(): void {
    this.matPaginator.length = this.route.snapshot.data['playlists'].count;
    this.total = this.route.snapshot.data['playlists'].count;
    this.changeDetectorRef.detectChanges();
  }

  openBottomSheet(playlist: any) {
    const ref = this.bottomSheet.open(PlaylistBottomSheetComponent, {
      data: {
        playlist
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminar(playlist.id);
      }
      if (result === 'edit') {
        this.edit(playlist);
      }
    });
  }

  paginate(data) {
    this.filters.page = data.pageIndex + 1;
    this.filters.page_size = data.pageSize;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const filters = {...this.filters, ...this.filtersForm.value};
    if (filters.nombre__wildcard) {
      filters.nombre__wildcard = filters.nombre__wildcard + '*';
    }
    this.playlistService.getAll(filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe((resp: any) => {
        this.playlists = resp.results;
        this.filters.page = resp.next;
        this.total = resp.count;
      });
  }

  private listenPaginator() {
    this.matPaginator.page.subscribe(data => {
      this.filters.page = data.pageIndex + 1;
      this.filters.page_size = data.pageSize;
      this.loadData();
    });
  }
}
