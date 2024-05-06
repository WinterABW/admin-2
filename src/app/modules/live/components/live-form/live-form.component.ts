import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {PalabrasClavesService} from '../../../../services/palabras-claves.service';
import {debounceTime, distinctUntilChanged, retry, startWith, switchMap} from 'rxjs/operators';
import {UtilesService} from '../../../../services/utiles.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Live} from '../../../../models/live';
import {PrecioService} from '../../../../services/precio.service';
import {CanalService} from '../../../../services/canal.service';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-live-form',
  templateUrl: './live-form.component.html',
  styleUrls: ['./live-form.component.scss']
})
export class LiveFormComponent implements OnInit {
  @Input() clave: string;
  @Input() type = 'ADD';
  @Input() live: Live;
  liveForm: UntypedFormGroup;
  keywords = [];
  selectedPalabras = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  palabrasCtrl = new UntypedFormControl();
  palabrasFiltradas: Observable<any>;
  idsPalabras: any[] = [];
  @ViewChild('chipList', {static: true}) chipList;
  @ViewChild('palabrasInput', {static: true}) palabrasInput: ElementRef<HTMLInputElement>;
  palabras;
  @Output() saveForm = new EventEmitter();
  precios$: Observable<any>;
  canales$;
  selectedImagen: string | ArrayBuffer;

  constructor(
    private fb: UntypedFormBuilder,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar,
    private palabrasClavesService: PalabrasClavesService,
    private utilService: UtilesService,
    private precioService: PrecioService,
    private canalService: CanalService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.listenPalabraCtrl();
    this.loadPrecios();
    this.loadCanales();


  }

  selectImg(imagen: HTMLInputElement) {
    const urlImagen = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.liveForm.patchValue({url_imagen: urlImagen});
    this.liveForm.get('url_imagen').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(urlImagen);
    fr.onload = () => {
      this.selectedImagen = fr.result;
    };

  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
  };

  loadCanales() {
    this.canales$ = this.canalService.getA({page_size: 100, ordering: 'nombre'});
  }

  refreshCode(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    this.publicationService.generarClave().pipe(
    ).subscribe(clave => {
      this.liveForm.get('clave_emision').setValue(clave);
    });
  }

  listenPalabraCtrl() {
    this.palabrasFiltradas = this.palabrasCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap((palabra: string | null) => this.palabrasClavesService.getByQuery(palabra ? {palabra__wildcard: palabra} : {})));
  }

  createWord(word: string) {
    this.palabrasClavesService.create(word).subscribe((newWord: any) => {
      this.idsPalabras = [...this.idsPalabras, newWord.id];
    });
  }

  remove(palabra: string): void {
    const index = this.selectedPalabras.indexOf(palabra);

    if (index >= 0) {
      this.selectedPalabras.splice(index, 1);
      this.idsPalabras.splice(index, 1);
    }
    if (this.selectedPalabras.length === 0) {
      this.chipList.errorState = true;

    }
    this.liveForm.get('palabraClave').markAsDirty();

  }

  add($event: MatChipInputEvent) {
    if ($event.value.trim()) {
      const word = $event.value.trim();
      this.selectedPalabras.push(word);
      this.createWord(word);
      this.liveForm.get('palabraClave').markAsDirty();

    }
    $event.input.value = '';
    this.palabrasCtrl.setValue(null);
    this.chipList.errorState = false;
  }

  selected($event: MatAutocompleteSelectedEvent) {
    this.selectedPalabras.push($event.option.value.palabra);
    this.idsPalabras = [...this.idsPalabras, $event.option.value.id];
    this.palabrasInput.nativeElement.value = '';
    this.palabrasCtrl.setValue(null);
    this.chipList.errorState = false;
    this.liveForm.get('palabraClave').markAsDirty();

  }

  save() {
    this.liveForm.get('palabraClave').setValue(this.idsPalabras);
    if (this.liveForm.valid) {
      let value;
      if (this.type === 'ADD') {
        value = this.liveForm.value;
      } else {
        value = this.utilService.getDirtyValues(this.liveForm);
      }
      delete value.url_emision;
      this.saveForm.emit(value);
    }
  }

  copy(evt: MouseEvent, type: string) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    let text;
    if (type === 'url') {
      text = this.liveForm.get('url_emision').value;
    } else {
      text = this.clave;
    }
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Copiado al portapapeles');
    });
  }

  selectImagenDialog($event: MouseEvent, imagen: HTMLInputElement) {
    $event.preventDefault();
    imagen.click();
  }

  private loadPrecios() {
    this.precios$ = this.precioService.getAll();
  }

  private initForm() {
    this.liveForm = this.fb.group({
      nombre: [this.live ? this.live.nombre : '', [Validators.required]],
      descripcion: [this.live ? this.live.descripcion : '', [Validators.required]],
      tipo: [this.live ? this.live.tipo : 'live', [Validators.required]],
      tipologia: [this.live ? this.live.categoria.tipologia.id : 9, [Validators.required]],
      clave_emision: [this.live ? this.live.categoria.live.clave_emision : this.clave, this.live ? [] : [Validators.required]],
      url_emision: ['rtmp://live.picta.cu:1935/stream', []],
      palabraClave: [this.live ? this.live.palabraClave_data.map(p => p.id) : [], [Validators.required]],
      mostrar_comentarios: [this.live ? this.live.mostrar_comentarios : true],
      mostrar_chat: [this.live ? this.live.mostrar_chat : false],
      publicado: [this.live ? this.live.publicado : false, [Validators.required]],
      internacional: [this.live ? this.live.internacional : false, [Validators.required]],
      precios: [[]],
      canal: [this.live ? this.live.canal.id : '', [Validators.required]],
      url_imagen: [this.live ? this.live.url_imagen : '', [Validators.required]],
      // duracion: [10, [Validators.required]],

    });
    if (this.live) {
      this.selectedPalabras = this.live.palabraClave;
      this.idsPalabras = this.live.palabraClave_data.map(p => p.id);
      this.selectedImagen = this.live.url_imagen + '_250x180';
      this.liveForm.get('tipo').markAsDirty();

    }
  }
}
