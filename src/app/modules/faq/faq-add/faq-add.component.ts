import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FaqService } from 'src/app/services/faq.service';

@Component({
  selector: 'app-faq-add',
  templateUrl: './faq-add.component.html',
  styleUrls: ['./faq-add.component.scss']
})
export class FaqAddComponent implements OnInit {
  form: UntypedFormGroup;
  state$: Observable<any>;
  mode: 'edit' | 'add' = 'add';
  id: number;

  constructor(
    private fb: UntypedFormBuilder,
    private faqService: FaqService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => window.history.state));
    this.state$.subscribe(state => {
      if (state.id) {
        this.mode = 'edit';
        this.id = state.id;
        this.faqService.get(this.id).subscribe(data => {
          this.form.patchValue(data);
        })
      }
    })
  }

  save() {
    if (this.mode === 'add') {
      this.faqService.create(this.form.value).subscribe(data => {
        this.snackBar.open('Pregunta adicionada correctamente.');
        this.router.navigateByUrl('/faq');
      }, error => {
        this.snackBar.open('Error al crear la pregunta. Error:' + error.msg)
      })
    } else {
      this.faqService.update(this.id, this.form.value).subscribe(res => {
        this.snackBar.open('Pregunta editada correctamente.');
        this.router.navigateByUrl('/faq');
      }, error => {
        this.snackBar.open('Error al editar la pregunta. Error:' + error.msg)
      })
    }
  }

  private initForm() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      texto: ['', [Validators.required]]
    })
  }
}
