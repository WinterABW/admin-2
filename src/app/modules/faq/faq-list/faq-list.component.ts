import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { FaqService } from 'src/app/services/faq.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  displayedColumns: string[] = ['titulo', 'texto', 'operations'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  loading = true;

  constructor(
    private faqService: FaqService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.load();

  }

  load() {
    this.loading = true;
    this.faqService.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: any) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      });
  }

  eliminarPregunta(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar esta pregunta?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.faqService.delete(id).subscribe(
          () => {
            this.snackBar.open('Pregunta eliminada correctamente.');
            this.load();
          },
          () => this.snackBar.open('No se pudo eliminar la pregunta.')
        );
      }
    });
  }

  edit(id: any) {
    this.router.navigate(['/faqs/add-edit'], { state: { id } });
  }
}
