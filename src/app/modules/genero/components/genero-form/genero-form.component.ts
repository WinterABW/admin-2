import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-genero-form',
  templateUrl: './genero-form.component.html',
  styleUrls: ['./genero-form.component.scss']
})
export class GeneroFormComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<GeneroFormComponent>,
    private fb: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  save() {
    this.matDialogRef.close(this.form.value);
  }

  private initForm() {
    this.form = this.fb.group({
      id: [this.data.genero ? this.data.genero.id : ''],
      nombre: [this.data.genero ? this.data.genero.nombre : '', [Validators.required]],
      tipo: [this.data.genero ? this.data.genero.tipo : '', [Validators.required]],
    });
  }
}
