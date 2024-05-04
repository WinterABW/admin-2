import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from 'src/app/services/user.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { SearchService } from '../../../../services/search.service';

import { Router } from '@angular/router';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { AuthService } from '../../../../services/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DetailsUserComponent } from '../details-user/details-user.component';
import { UserBottomsheetComponent } from '../user-bottomsheet/user-bottomsheet.component';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pageEvent: PageEvent = {
    length: 100,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0
  };

  appearance: MatFormFieldAppearance = 'legacy' as MatFormFieldAppearance;

  displayedColumns: string[] = [
    'first_name',
    'date_joined',
    'phone_number',
    'is_superuser',
    'is_staff',
    'is_activate',
    'baja',
    'roles',
    'operaciones'
  ];

  dataSource = new MatTableDataSource<any>();
  filtersForm: UntypedFormGroup;
  totalCount: any;
  loading = true;

  constructor(
    private fb: UntypedFormBuilder,
    private usuariosService: UsuariosService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private router: Router,
    public authService: AuthService,
    private bottomSheet: MatBottomSheet
  ) {
  }

  ngOnInit() {
    this.initFormFilters();
    this.getListByParams();

  }

  paginar(event?: PageEvent) {
    this.filtersForm.patchValue({ page: event.pageIndex + 1, page_size: event.pageSize });
    this.getListByParams();
    return event;
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este usuario?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuariosService.delete(id).subscribe(
          () => {
            this.matSnackBar.open('Usuario eliminado correctamente.');
            this.getListByParams();

          },
          () => this.matSnackBar.open('No se pudo eliminar el usuario.')
        );
      }
    });
  }

  edit(id: any) {
    this.router.navigate(['/usuarios/edit', id]);
  }

  changePasswordModal(id: any) {
    const ref = this.dialog.open(ChangePasswordDialogComponent, {
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: true,
      role: 'dialog',
      data: { id, new_password: '' }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.matSnackBar.open('Contraseña cambiada correctamente.', null, { duration: 3000 });
      }
    });
  }

  openBottomSheet(user: any) {
    const ref = this.bottomSheet.open(UserBottomsheetComponent, {
      data: {
        user
      }
    });
    ref.afterDismissed().subscribe(result => {
      if (result === 'delete') {
        this.eliminar(user.id);
      }
      if (result === 'details') {
        this.detailsUser(user);
      }
      if (result === 'change-password') {
        this.changePasswordModal(user.id);
      }
    });
  }

  paginate(data) {
    this.filtersForm.get('page').setValue(data.pageIndex + 1);
    this.filtersForm.get('page_size').setValue(data.pageSize);
    this.getListByParams();
  }

  private initFormFilters() {
    this.filtersForm = this.fb.group({
      criterio: [''],
      email__contains: [''],
      phone_number__wildcard: [''],
      is_active: [''],
      baja: [''],
      page_size: ['10'],
      page: ['1']
    });
    this.filtersForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.getListByParams();
    });
  }

  getListByParams() {
    this.loading = true;
    const filters = this.filtersForm.value;
    this.usuariosService.getAll(filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe((resp: any) => {
        this.dataSource.data = resp.results;
        this.paginator.length = resp.count;
        this.totalCount = resp.count;
      });
  }

  private detailsUser(user) {
    this.dialog.open(DetailsUserComponent, {
      minWidth: '95vw',
      // minHeight: '100vh',
      data: {
        user
      }
    });
  }
}
