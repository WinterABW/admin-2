import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';

import {NotificationService} from '../../../services/notification-g.service';
import {Tipologia} from '../../../models/tipologia.model';
import {finalize} from 'rxjs/operators';
import { TipologiaService } from 'src/app/services/tipologia.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-tipologia',
  templateUrl: './tipologia.component.html',
  styleUrls: ['./tipologia.component.scss']
})
export class TipologiaComponent implements OnInit {
  tipologiaForm: UntypedFormGroup;
  tipologias: Tipologia[];
  isEditMode = false;
  errorTxt: string;
  displayedColumns: string[] = ['id', 'nombre', 'modelo', 'actions'];
  tipologiasDataSource = new MatTableDataSource<any>();
  @ViewChild('tableTipologias', {static: true}) tableTipologias: MatTable<any>;
  @ViewChild('matPaginatorTableTipologias', {static: true}) matPaginatorTableTipologias: MatPaginator;
  loading = true;
  appearance: MatFormFieldAppearance = 'legacy' as MatFormFieldAppearance;



  constructor(private fb: UntypedFormBuilder,
              private tipologiaService: TipologiaService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.tipologiaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      modelo: ['', Validators.required],
    });
    this.loadData();

  }

  loadData() {
    this.loading = true;
    this.tipologiaService.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe((tipologias: Tipologia[]) => {
        this.tipologias = tipologias;
        this.tipologiasDataSource.data = this.tipologias;
      }, error1 => {
        this.tipologias = [
          {id: 1, nombre: 'video', modelo: 'video'},
          {id: 2, nombre: 'audio', modelo: 'audio'},
          {id: 3, nombre: 'reportaje', modelo: 'reportaje'},
          {id: 4, nombre: 'documental', modelo: 'documental'},
        ];
        this.tipologiasDataSource.data = this.tipologias;
    });
  }

  addTipologia() {
    this.tipologiaService.add(this.tipologiaForm.value).subscribe((res: Tipologia) => {
        this.tipologias.push(res);
        this.tipologiasDataSource.data = this.tipologias;
        this.tableTipologias.renderRows();
        this.notificationService.open('ok', 'Tipología adicionada correctamente.');

        this.tipologiaForm.reset();
        this.errorTxt = '';
      },
      error => error.status === 400
        ? this.notificationService.open('ok', `Ya existe una tipología con nombre ${this.tipologiaForm.value.nombre}`)
        : this.notificationService.open('ok', ` Ha orurrido un error`));
  }

  deleteTipologia(id: number) {
    if (confirm('¿Estás seguro que deseas eliminar esta tipología?')) {

      this.tipologiaService.delete(id).subscribe(res => {
          this.tipologias = this.tipologias.filter(item => item.id !== id);
          this.tipologiasDataSource.data = this.tipologias;
          this.tableTipologias.renderRows();
          this.notificationService.open('ok', 'Tipología eliminada correctamente');

        },
        () => alert('No se puede eliminar esta tipología pues está en uso.'));
    }

  }

  editTipologia(id: number) {
    this.tipologiaForm.patchValue(this.tipologias.filter(i => i.id === id)[0]);
    this.isEditMode = true;

  }

  updateTipologia() {
    const id = this.tipologiaForm.value.id;
    this.tipologiaService.update(this.tipologiaForm.value).subscribe(res => {
      this.isEditMode = false;
      this.tipologiaForm.reset();
      this.loadData();

    });
  }
}
