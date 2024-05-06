import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import { TemporadaService } from 'src/app/services/temporada.service';

@Component({
  selector: 'app-add-temporada-form',
  templateUrl: './add-temporada-form.component.html',
  styleUrls: ['./add-temporada-form.component.scss']
})
export class AddTemporadaFormComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(private tempService: TemporadaService, private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<AddTemporadaFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {
    if (this.data.modelo !== 'curso') {
      if (!this.data.canal || !this.data.serie) {
        this.snackBar.open('Primero debe seleccionar un canal y una serie.');
        this.dialogRef.close();
      }
    } else {
      if (!this.data.canal) {
        this.snackBar.open('Primero debe seleccionar un canal.');
        this.dialogRef.close();
      }
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      cant_cap: [0, [Validators.required]],
      numero: ['', [Validators.required]],
      canal: [this.data.canal, [Validators.required]],
      serie: [this.data.serie, [Validators.required]],
    });

  }

  save() {
    this.tempService.create(this.form.value).pipe(
      catchError(error => {
        this.snackBar.open(error.error[0]);
        return throwError(error);

      })
    ).subscribe(newTemp => {
      this.dialogRef.close(newTemp);
    },);
  }

}
