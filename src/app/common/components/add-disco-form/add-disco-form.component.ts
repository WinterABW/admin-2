import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { DiscoService } from 'src/app/services/disco.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ExtraService } from 'src/app/services/extra.service';
import { GeneroService } from 'src/app/services/genero.service';

@Component({
  selector: 'app-add-disco-form',
  templateUrl: './add-disco-form.component.html',
  styleUrls: ['./add-disco-form.component.scss']
})
export class AddDiscoFormComponent implements OnInit {
  extrasProductora: any;
  filteredExtraProductora: any;
  selectedImagen: string | ArrayBuffer;
  form: UntypedFormGroup;
  genres$;
  personasList: any;
  filteredPersonasList: any;

  constructor(
    public dialogRef: MatDialogRef<AddDiscoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private discoService: DiscoService,
    private personaService: PersonaService,
    private fb: UntypedFormBuilder,
    private extraService: ExtraService,
    private genreService: GeneroService,
  ) {
    if (!this.data.canal) {
      this.snackBar.open('Primero debe seleccionar un canal.');
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    this.loadGenres();
    this.loadExtras();
    this.loadPersonas();

    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      canal: [this.data.canal, [Validators.required]],
      interprete: ['', [Validators.required]],
      casa_disquera: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      sello: ['', [Validators.required]],
      release_date: ['', [Validators.required]],
      sale_start_date: ['', [Validators.required]],
    });
  }

  save() {
    this.discoService.create(this.form.value).subscribe(disco => {
      this.dialogRef.close(disco);
    });
  }

  clickImg($event: MouseEvent, imagen: HTMLInputElement) {
    $event.preventDefault();
    imagen.click();
  }

  selectImg(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');

    this.form.patchValue({imagen: image});
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedImagen = fr.result;
    };

  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
  }

  loadPersonas() {
    this.personaService.getAll().subscribe(personas => {
      this.personasList = personas;
      this.filteredPersonasList = this.personasList;
    });
    // this.filteredPersonasList = this.personasList;
  }

  searchPersona($event: { term: string; items: any[] }) {
    const {term} = $event;
    if (term) {
      this.personaService.getByQuery({nombre__wildcard: term + '*'}).subscribe(personas => {
        this.filteredPersonasList = personas;
      });
    } else {
      this.filteredPersonasList = this.personasList;
    }
  }

  addNewPersona = (name) => {
    this.personaService.create(name).subscribe((newPersona: any) => {
      this.personasList = [newPersona, ...this.personasList];
      this.filteredPersonasList = this.personasList;
    });
  }

  addNewExtraProductora = (name) => {
    const tipo = 'casa_disquera';
    this.extraService.create({nombre: name, tipo}).subscribe((newExtra: any) => {
      this.extrasProductora = [newExtra, ...this.extrasProductora];
      this.filteredExtraProductora = this.extrasProductora;
    });
  }

  searchExtraProductora($event: { term: string; items: any[] }) {
    const {term} = $event;
    if (term) {
      this.extraService.getByQuery({nombre__wildcard: term + '*', tipo: 'casa_disquera'}).subscribe(extras => {
        this.filteredExtraProductora = extras;
      });
    } else {
      this.filteredExtraProductora = this.extrasProductora;
    }
  }

  loadGenres() {
    this.genres$ = this.genreService.getAllByTipo('mu');
  }

  loadExtras() {
    this.extraService.getByType('casa_disquera').subscribe(value => {
      this.extrasProductora = value;
      this.filteredExtraProductora = this.extrasProductora;
    });
  }

}
