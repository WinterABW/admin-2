import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {SerieService} from '../../../services/serie.service';
import {GeneroService} from '../../../services/genero.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CanalService} from '../../../services/canal.service';
import {Router} from '@angular/router';
import {PersonaService} from '../../../services/persona.service';
import {ExtraService} from '../../../services/extra.service';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-serie-add',
  templateUrl: './serie-add.component.html',
  styleUrls: ['./serie-add.component.scss']
})
export class SerieAddComponent implements OnInit {

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
  selectedPath: string;

  constructor(
    private serieService: SerieService,
    private fb: UntypedFormBuilder,
    private genreService: GeneroService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private canalService: CanalService,
    private router: Router,
    private personaService: PersonaService,
    private extraService: ExtraService
  ) {

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
  }

  getYears(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map(i => i + startFrom);
  }

  save() {
    this.serieService.create(this.form.value).subscribe(newSerie => {
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
    this.canales$ = this.canalService.getA({ordering: 'nombre', page_size: 100});

  }

  private loadGenres() {
    this.genres$ = this.genreService.getAllByTipo('ci');
  }

  addNewPersona = async (name) => {
    const newPersona = await this.personaService.create(name).toPromise();
    this.personasList = [newPersona, ...this.personasList];
    this.filteredPersonasList = this.personasList;
    return newPersona;
  }

  addNewExtraProductora = async (name) => {
    const tipo = 'productora';
    const newExtra = await this.extraService.create({nombre: name, tipo}).toPromise();
    this.extrasProductora = [newExtra, ...this.extrasProductora];
    this.filteredExtraProductora = this.extrasProductora;
    return newExtra;
  }

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
}
