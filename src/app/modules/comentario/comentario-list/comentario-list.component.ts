import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../services/auth.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ComentarioBottomsheetComponent } from '../comentario-bottomsheet/comentario-bottomsheet.component';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  tap,
} from 'rxjs/operators';
import { ComentarioService } from '../state/comentario.service';
import { ComentarioQuery } from '../state/comentario.query';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

const baseUrlv2 = environment.baseUrlv2;

@Component({
  selector: 'app-comentario-list',
  templateUrl: './comentario-list.component.html',
  styleUrls: ['./comentario-list.component.scss'],
})
export class ComentarioListComponent implements OnInit {
  displayedColumns: string[] = [
    'status',
    'texto',
    'fecha',
    'nombre_usuario',
    'publicacion',
    'publicado',
    'operations',
  ];
  comentarios$:any
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  disableToggle = false;
  params = {
    page: 1,
    page_size: 10,
  };
  total: number;
  @ViewChild('answerDialog') answerDialog: TemplateRef<any>;
  commentForm: UntypedFormGroup;
  answerDialogRef: MatDialogRef<any>;
  loading = true;
  filters: UntypedFormGroup;

  constructor(
    private commentService: CommentService,
    private comentarioService: ComentarioService,
    private snackBar: HotToastService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    public authService: AuthService
  ) {
    
  }

  ngOnInit() {
    this.initForm();
    this.load();    
  }

  load() {
    this.loading = true;
    const filters = this.filters.value;
    if (!filters.search) {
      delete filters.search;
    }
    if (filters.eliminado === 'all') {
      delete filters.eliminado;
    }
    this.comentarioService
      .get({
        url: baseUrlv2 + '/comentario/',
        params: { ...this.params, ...filters },
        mapResponseFn: (response) => {
          this.total = response.count;
          this.comentarios$=response.results
          return response.results;
        },
      })
      // this.commentService.get_comentarios({...this.params, ...filters})
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data: any) => {
        // this.comentarios = data.results;
      });
  }

  eliminarComentario(element) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este comentario?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.comentarioService
          .delete(element.id, {
            skipWrite: true,
          })
          .pipe(
            this.snackBar.observe({
              loading: 'Eliminando comentario',
              success: 'Comentario eliminado correctamente',
              error: 'No se puedo eliminar el comentario',
            })
          )
          .subscribe(() => {
            this.total -= 1;
            this.load();
          });
      }
    });
  }

  togglePublicado(id: any, status: boolean) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: status
          ? '¿Está seguro que desea publicar este comentario?'
          : '¿Está seguro que desea ocultar este comentario?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.disableToggle = true;
        this.commentService
          .togglePublicado(id, status)
          .pipe(
            this.snackBar.observe({
              loading: 'Actualizando comentario',
              success: 'Comentario actualizado correctamente',
              error: 'No se puedo actualizar el comentario',
            })
          )
          .subscribe(
            () => {
              this.disableToggle = false;
              this.load();
            },
            () => {
              this.disableToggle = false;
            }
          );
      }
    });
  }

  paginate($event: PageEvent) {
    this.params.page = $event.pageIndex + 1;
    this.params.page_size = $event.pageSize;
    this.total = $event.length;
    this.load();
  }

  asnwerComment(comment: any) {
    this.commentForm.get('publicacion').setValue(comment.publicacion.id);
    this.commentForm.get('comentario').setValue(comment.id);
    this.answerDialogRef = this.dialog.open(this.answerDialog, {
      minWidth: '360px',
    });
    this.answerDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load();
      }
    });
  }

  saveComment() {
    if (this.commentForm.valid) {
      this.commentService
        .addRespuesta(this.commentForm.value)
        .pipe(
          this.snackBar.observe({
            loading: 'Eviando respuesta comentario',
            success: 'Respuesta enviada correctamente',
            error: 'Error al enviar el comentario',
          })
        )
        .subscribe((data) => {
          this.commentForm.get('texto').reset();
          this.answerDialogRef.close(true);
        });
    }
  }

  private initForm() {
    this.filters = this.fb.group({
      search: [''],
      publicacion_nombre__contains: [''],
      usuario_nombre__contains: [''],
      eliminado: ['all'],
    });
    this.filters.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.load())
      )
      .subscribe();
    this.commentForm = this.fb.group({
      publicacion: ['', [Validators.required]],
      texto: ['', [Validators.required]],
      usuario: [true, [Validators.required]],
      comentario: ['', [Validators.required]],
    });
  }

  openBottomSheet(comment: any) {
    const ref = this.bottomSheet.open(ComentarioBottomsheetComponent, {
      data: {
        comment,
      },
    });
    ref.afterDismissed().subscribe((result) => {
      if (result === 'delete') {
        this.eliminarComentario(comment);
      }
      if (result === 'toggle-visibility') {
        this.togglePublicado(comment.id, !comment.publicado);
      }
      if (result === 'answer') {
        this.asnwerComment(comment);
      }
    });
  }
}
