import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {TemporadaService} from '../../../services/temporada.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CanalService} from '../../../services/canal.service';
import {SerieService} from '../../../services/serie.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-temporada-edit',
  templateUrl: './temporada-edit.component.html',
  styleUrls: ['./temporada-edit.component.scss']
})
export class TemporadaEditComponent implements OnInit {
  form: UntypedFormGroup;
  canales$: Observable<any>;
  series$: any;
  temporada;

  constructor(
    private tempService: TemporadaService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private canalService: CanalService,
    private serieService: SerieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.temporada = this.route.snapshot.data['temporada'];

  }

  ngOnInit() {
    this.loadCanales();
    this.loadSeries();
    this.form = this.fb.group({
      nombre: [this.temporada.nombre, [Validators.required]],
      cantidad_capitulos: [this.temporada.cantidad_capitulos, [Validators.required]],
      numero: [this.temporada.numero, [Validators.required]],
      canal: [this.temporada.canal.id, [Validators.required]],
      serie: [this.temporada.serie.pelser_id, [Validators.required]],
    });
  }

  save() {
    this.tempService.update(this.temporada.id, this.form.value).subscribe(newTemp => {
      this.snackBar.open('Temporada actualizada correctamente');
      this.router.navigate(['/temporadas/list']);
    });
  }

  loadCanales() {
    this.canales$ = this.canalService.getA({ordering: 'nombre', page_size: 100});
  }

  loadSeries() {
    this.series$ = this.serieService.getAll();
  }

}
