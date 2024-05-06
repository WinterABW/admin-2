import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {SerieService} from 'src/app/services/serie.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {CanalService} from 'src/app/services/canal.service';
import {GeneroService} from 'src/app/services/genero.service';
import {PersonaService} from '../../../services/persona.service';
import {ExtraService} from '../../../services/extra.service';

@Component({
  selector: 'app-serie-edit',
  templateUrl: './serie-edit.component.html',
  styleUrls: ['./serie-edit.component.scss']
})
export class SerieEditComponent implements OnInit {

  form: UntypedFormGroup;
  genres$;
  years = this.getYears(new Date().getFullYear() - 1899, 1900);
  filteredYears = this.years;
  canales$;
  personasList: any;
  extrasPremio;
  extrasProductora;
  filteredPersonasList: any;
  filteredExtraProductora: any;
  filteredExtraPremio: any;
  selectedImagen: string | ArrayBuffer;
  serie;

  constructor(
    private serieService: SerieService,
    private fb: UntypedFormBuilder,
    private genreService: GeneroService,
    private snackBar: MatSnackBar,
    private canalService: CanalService,
    private router: Router,
    private route: ActivatedRoute,
    private personaService: PersonaService,
    private extraService: ExtraService,
  ) {
    this.serie = this.route.snapshot.data['serie'];

  }

  ngOnInit() {
    this.loadGenres();
    this.loadCanales();
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      cantidad_temporadas: ['', [Validators.required]],
      cantidad_capitulos: ['', [Validators.required]],
      canal: ['', [Validators.required]],
      ano: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      genero: ['', []],
      productora: ['', []],
      director: ['', []],
      premio: ['', []],
      reparto: ['', []],
      fotografia: ['', []],
      musica: ['', []],
      guion: ['', []],
      imagen_secundaria: ['', [Validators.required]],
    });
    this.loadPersonas();
    this.loadExtras();
    this.form.patchValue(this.serie);
    this.form.patchValue({genero: this.serie.genero.map(g => g.id)});
    this.form.get('canal').patchValue(this.serie.canal.id);
    this.selectedImagen = this.serie.imagen_secundaria + '_300x200';
  }

  getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });

    return dirtyValues;
  }

  getYears(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map(i => i + startFrom);
  }

  save() {
    this.serieService.update(this.serie.pelser_id, this.getDirtyValues(this.form)).subscribe(newSerie => {
      this.snackBar.open('Serie adicionada correctamente');
      this.router.navigate(['/series/list']);

    });
  }

  clickImgSecundaria($event, imagen_secundaria: HTMLInputElement) {
    $event.preventDefault();
    imagen_secundaria.click();
  }

  selectImgSecundaria(imagen_secundaria: HTMLInputElement) {
    const image = this.blobToFile(imagen_secundaria.files[0], 'img.jpeg');
    this.form.patchValue({imagen_secundaria: image});
    this.form.get('imagen_secundaria').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedImagen = fr.result;
    };


  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
  };

  loadCanales() {
    this.canales$ = this.canalService.getA();
  }

  addNewPersona = (name) => {
    this.personaService.create(name).subscribe((newPersona: any) => {
      this.personasList = [newPersona, ...this.personasList];
      this.filteredPersonasList = this.personasList;
    });
  };

  searchExtraProductora($event: { term: string; items: any[] }) {
    const {term} = $event;
    if (term) {
      this.extraService.getByQuery({nombre__wildcard: term + '*', tipo: 'productora'}).subscribe(extras => {
        this.filteredExtraProductora = extras;
      });
    } else {
      this.filteredExtraProductora = this.extrasProductora;
    }
  }

  searchExtraPremio($event: { term: string; items: any[] }) {
    const {term} = $event;
    if (term) {
      this.extraService.getByQuery({nombre__wildcard: term + '*', tipo: 'premio'}).subscribe(extras => {
        this.filteredExtraPremio = extras;
      });
    } else {
      this.filteredExtraPremio = this.extrasPremio;
    }
  }

  addNewExtraProductora = (name) => {
    const tipo = 'productora';
    this.extraService.create({nombre: name, tipo}).subscribe((newExtra: any) => {
      this.extrasProductora = [newExtra, ...this.extrasProductora];
      this.filteredExtraProductora = this.extrasProductora;
    });
  };

  addNewExtraPremio = (name) => {
    const tipo = 'premio';
    this.extraService.create({nombre: name, tipo}).subscribe((newExtra: any) => {
      this.extrasPremio = [newExtra, ...this.extrasPremio];
      this.filteredExtraPremio = this.extrasPremio;
    });
  };

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

  loadExtras() {
    this.extraService.getByType('premio').subscribe(result => {
      this.extrasPremio = result;
      this.filteredExtraPremio = this.extrasPremio;
    });
    this.extraService.getByType('productora').subscribe(value => {
      this.extrasProductora = value;
      this.filteredExtraProductora = this.extrasProductora;
    });
  }

  loadPersonas() {
    this.personasList = this.personaService.getAll().subscribe(personas => {
      this.personasList = personas;
      this.filteredPersonasList = this.personasList;
    });
  }

  private loadGenres() {
    this.genres$ = this.genreService.getAllByTipo('ci');
  }

}

