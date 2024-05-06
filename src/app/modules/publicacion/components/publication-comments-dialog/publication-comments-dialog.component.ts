import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommentService} from '../../../../services/comment.service';

@Component({
  selector: 'app-publication-comments-dialog',
  templateUrl: './publication-comments-dialog.component.html',
  styleUrls: ['./publication-comments-dialog.component.scss']
})
export class PublicationCommentsDialogComponent implements OnInit {
  options = {
    suppressScrollX: true
  };
  @ViewChild('answerDialog') answerDialog: TemplateRef<any>;
  commentForm: UntypedFormGroup;
  answerDialogRef: MatDialogRef<any>;

  constructor(
    public dialogRef: MatDialogRef<PublicationCommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private commentService: CommentService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  asnwerComment(comment: any) {
    this.commentForm.get('publicacion').setValue(comment.publicacion.id);
    this.commentForm.get('comentario').setValue(comment.id);
    this.answerDialogRef = this.dialog.open(this.answerDialog, {
      minWidth: '360px',
    });
    this.answerDialogRef.afterClosed().subscribe(data => {
      // reloadComments
    });
  }

  saveComment() {
    if (this.commentForm.valid) {
      this.commentService.addRespuesta(this.commentForm.value).subscribe(data => {
          this.snackBar.open('Respuesta enviada correctamente');
          this.commentForm.get('texto').reset();
          this.answerDialogRef.close(true);
        }, error => this.snackBar.open('Error al enviar el comentario')
      );
    }
  }

  private initForm() {
    this.commentForm = this.fb.group({
      publicacion: ['', [Validators.required]],
      texto: ['', [Validators.required]],
      usuario: [true, [Validators.required]],
      comentario: ['', [Validators.required]]
    });
  }
}
