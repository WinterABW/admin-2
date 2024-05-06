import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {TemporadaService} from '../../../services/temporada.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CanalService} from '../../../services/canal.service';
import {SerieService} from '../../../services/serie.service';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-temporada-add',
  templateUrl: './temporada-add.component.html',
  styleUrls: ['./temporada-add.component.scss']
})
export class TemporadaAddComponent implements OnInit {
  form: UntypedFormGroup;
  canales$: Observable<any>;
  series$: any;

  constructor(private tempService: TemporadaService, private fb: UntypedFormBuilder, private snackBar: MatSnackBar, private canalService: CanalService, private serieService: SerieService, private router: Router) {

  }

  ngOnInit() {
    this.loadCanales();
    this.loadSeries();
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      cant_cap: [0, [Validators.required]],
      numero: ['', [Validators.required]],
      canal: ['', [Validators.required]],
      serie: ['', [Validators.required]],
    });
  }

  save() {
    if (this.form.valid) {
      this.tempService.create(this.form.value).pipe(
        catchError(error => {
          this.snackBar.open(error.error[0]);
          return throwError(error);

        })
      ).subscribe(newTemp => {
        this.snackBar.open('Temporada creada correctamente');
        this.router.navigate(['/temporadas/list']);
      });

    }
  }

  loadCanales() {
    this.canales$ = this.canalService.getA({ordering: 'nombre', page_size: 100});
  }

  loadSeries() {
    this.series$ = this.serieService.getAll();
  }

}
