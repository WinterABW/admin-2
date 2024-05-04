import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from '../../../../services/user.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, new_password: string },
    private usuarioService: UsuariosService
  ) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  changePassword() {
    this.usuarioService.changePassword(this.data).subscribe(res => {
      this.dialogRef.close(res);
    });
  }
}
