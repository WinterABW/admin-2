import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, retry, startWith, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {  HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CanalService } from '../../../../services/canal.service';
import { TipologiaService } from '../../../../services/tipologia.service';
import { PalabrasClavesService } from '../../../../services/palabras-claves.service';
import { SerieService } from '../../../../services/serie.service';
import { TemporadaService } from '../../../../services/temporada.service';
import { GeneroService } from '../../../../services/genero.service';
import { CapituloService } from '../../../../services/capitulo.service';
import { DiscoService } from '../../../../services/disco.service';
import { AuthService } from '../../../../services/auth.service';
import { PersonaService } from '../../../../services/persona.service';
import { ExtraService } from '../../../../services/extra.service';
import { HotToastService } from '@ngneat/hot-toast';
import { EventService } from 'src/app/services/event.service';
import { PublicationService } from 'src/app/services/publication.service';
import { PrecioService } from 'src/app/services/precio.service';
import { AddTemporadaFormComponent } from 'src/app/common/components/add-temporada-form/add-temporada-form.component';
import { AddSerieFormComponent } from 'src/app/common/components/add-serie-form/add-serie-form.component';
import { AddDiscoFormComponent } from 'src/app/common/components/add-disco-form/add-disco-form.component';
import { PlaylistService } from 'src/app/services/playlist.service';
import { PlaylistNewComponent } from '../../../playlist/components/playlist-new/playlist-new.component';


declare const VideoToFrames: any;
declare const VideoToFramesMethod: any;

interface PrecioTag {
  valor: number;
  tipo: 'descarga' | 'reproduccion';
}

@Component({
  selector: 'app-publication-add',
  templateUrl: './publication-add.component.html',
  styleUrls: ['./publication-add.component.scss'],

})
export class PublicationAddComponent implements OnInit {

  /*selectPlaylist(evt: MatSelectChange) {
    this.selectedPlaylist = evt.value;
  }*/
  eventos$: Observable<any>;
  canalHasSeller = false;
  selectedPath: string;

  constructor(
    private pubService: PublicationService,
    private canalService: CanalService,
    private palabrasClavesService: PalabrasClavesService,
    private tipologiaService: TipologiaService,
    private precioService: PrecioService,
    private serieService: SerieService,
    private eventService: EventService,
    private temporadaService: TemporadaService,
    private genreService: GeneroService,
    private matSnack: MatSnackBar,
    public router: Router,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private capituloService: CapituloService,
    private discoService: DiscoService,
    private sanitazer: DomSanitizer,
    private authService: AuthService,
    private personaService: PersonaService,
    private toast: HotToastService,
    private extraService: ExtraService,
    private playlistService: PlaylistService
  ) {
    this.routerState = this.router.getCurrentNavigation().extras.state as any;
    // this.loadPalabrasClaves();
    this.listenPalabraCtrl();
    this.loadPlaylist();
    this.loadPersonas();
    this.loadEventos();
    this.loadExtras();
    this.loadTvVivo();

  }

  get isAdmin() {
    return this.authService.groups.some(g => g.name === 'Administrador');
  }

  get isJefeCanal() {
    return this.authService.groups.some(g => g.name === 'Jefe de canal');
  }

  color: ThemePalette = 'primary';
  checked = true;
  disabled = false;
  canales$;
  palabras;
  tipologias$;
  selectedVideo;
  publicacion: any = {};
  selectedTipologia = 1;
  uploadingFile = false;
  progress = 0;
  selectedPalabras = [];
  form: UntypedFormGroup;
  @Output() backgroudProgress = new EventEmitter<number>();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('palabrasInput', { static: true }) palabrasInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: true }) chipList;
  palabrasCtrl = new UntypedFormControl();
  palabrasFiltradas: Observable<any>;
  precios$: Observable<any>;
  temporadas$: Observable<any>;
  series$: Observable<any>;
  genres$: Observable<any>;
  selectedImagen: string | ArrayBuffer;
  uploadRequest: Subscription;
  modeloSeleccionado = 'categoria';
  tipo: string;
  years = this.getYears(new Date().getFullYear() - 1899, 1900);
  filteredYears = this.years;
  urlMinioPub: any;
  selectedSubtitle: any;
  capitulos = [];
  discos = [];
  wordsIds = [];
  selectedImagenSecundaria: string | ArrayBuffer;
  selectedVideoBlob: any;
  filteredCanales = [];
  formDirective: any;
  formData = new FormData();
  urlVideo: any;
  personasList: any;
  extrasPremio;
  extrasProductora;
  idsPalabras: any[] = [];
  filteredPersonasList: any;
  isTvVivo = false;
  canalesEnVivo: Observable<any>;
  otherSource = false;
  otherSourceControl = new UntypedFormControl('');
  sourceControl = new UntypedFormControl('');
  canales = [
    {
      nombre: 'Cubavisión en Vivo',
      url_manifiesto: 'https://cdn.teveo.cu/live/video/vXykXvhUczkVP7R7/ngrp:9KJTMRBAm2BbnsYK.stream/playlist.m3u8'
    },
    {
      nombre: 'Tele Rebelde en Vivo',
      url_manifiesto: 'https://cdn.teveo.cu/live/video/vXykXvhUczkVP7R7/ngrp:rT9fDMXXb9ZkBNN9.stream/playlist.m3u8'
    },
    {
      nombre: 'Canal Caribe en Vivo',
      url_manifiesto: 'https://cdn.teveo.cu/live/video/8uAFHKPD2sWTEJdS/ngrp:CKZ3s6Wuv4gDjndG.stream/playlist.m3u8'
    },
    {
      nombre: 'Cubavisión Internacional en Vivo',
      url_manifiesto: 'https://cdn.teveo.cu/live/video/Hqp6Hb4Vq2GFNeGj/ngrp:gppfydfzpSUn9Udy.stream/playlist.m3u8'
    },
  ];
  filteredExtraProductora: any;
  filteredExtraPremio: any;
  frames: any[];
  routerState: any;
  showPlaylist: boolean;
  playlist: any[] = [];
  selectedPlaylist: any;
  playlistControl = new UntypedFormControl();
  precios: PrecioTag[] = [];

  getYears(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map(i => i + startFrom);
  }

  ngOnInit() {
    this.initForm();
    this.form.get('ano').valueChanges.subscribe((text: string) => {
      if (text) {
        this.filteredYears = this.years.filter((item: number) => item.toString().includes(text));
      } else {
        this.filteredYears = this.years;
      }
    });

    this.loadTipologias();
    this.loadCanales();
    // this.loadPrecios();
    this.loadSeries();
    this.loadDiscos();
    this.publicacion.tipo = 'publicacion';
    this.publicacion.precio = 2;
    this.publicacion.palabraClave = [];
    this.form.get('tipologia').valueChanges.subscribe(id => {
      this.tipologias$.subscribe(data => {
        const tipologia = data.filter(item => item.id === id)[0];
        this.modeloSeleccionado = tipologia.modelo;
        this.setTipoGenero();
        this.loadGenres();
        this.changeRequireds();
        if (this.modeloSeleccionado === 'curso') {
          this.loadTemps(null);
        }
      });
    });

    this.form.get('serie').valueChanges.subscribe(value => {
      this.loadTemps(value);
    });

    if (this.routerState) {
      this.form.patchValue(this.routerState.copy);

      this.routerState.copy.palabras_claves.forEach(keyW => {
        this.selectedPalabras.push(keyW.palabra);
        this.idsPalabras = [...this.idsPalabras, keyW.id];
      });
      const nombre: string = this.routerState.copy.nombre;
      if (this.routerState.copy.numero < 10) {
        this.form.get('nombre').setValue(nombre.slice(0, nombre.length - 1) + this.routerState.copy.numero);
      } else {
        this.form.get('nombre').setValue(nombre.slice(0, nombre.length - 2) + this.routerState.copy.numero);
      }
    }
  }

  listenPalabraCtrl() {
    this.palabrasFiltradas = this.palabrasCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap(
        (palabra: string | null) =>
          this.palabrasClavesService.getByQuery(
            palabra
              ? { palabra__wildcard: palabra }
              : {}
          )));
  }

  loadTipologias() {
    this.tipologias$ = this.tipologiaService.getAll().pipe(
      map(results => {
        return results.filter(r => r.modelo !== 'live');
      })
    );
  }

  loadCanales() {
    this.canales$ = this.canalService.getA({ page_size: 100, ordering: 'nombre' });
  }

  /*loadPalabrasClaves() {
    this.palabrasClavesService.getAll().subscribe((response: any) => {
      this.palabras = response;
      this.listenPalabraCtrl();

    });
  }*/

  initForm() {
    this.form = this.fb.group({
      tipo: ['publicacion', [Validators.required]],
      tipologia: [8, [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(90)]],
      descripcion: ['', []],
      canal: ['', [Validators.required]],
      palabras_claves: [this.selectedPalabras, [Validators.required]],
      publicado: [true, []],
      descargable: [true, []],
      mostrar_comentarios: [true, []],
      precios: [[], [Validators.required]],
      url_manifiesto: ['', [Validators.required]],
      url_imagen: ['', [Validators.required]],
      url_subtitulo: ['', []],
      interprete: ['', []],
      productor: ['', []],
      ano: ['', []],
      pais: ['', []],
      genero: ['', []],
      autor: ['', []],
      temporada: ['', []],
      serie: ['', []],
      productora: ['', []],
      director: ['', []],
      // videoclip
      director_fotografico: ['', []],
      director_arte: ['', []],
      director_artistico: ['', []],
      release_date: ['', []],
      guionista: ['', []],
      sale_start_date: ['', []],
      sello: ['', []],
      premio: ['', []],
      reparto: ['', []],
      fotografia: ['', []],
      musica: ['', []],
      guion: ['', []],
      imagen_secundaria: ['', []],
      numero: ['', []],
      disco: ['', []],
      portada: [false, []],
      internacional: [false, []],
      // cancion
      productor_ejecutivo: ['', []],
      publisher: ['', []],
      performer: ['', []],
      invitado: ['', []],
      isrc: ['', []],
      masterights: ['', []],
      pais_fonograma: ['', []],
      codigo_producto: ['', []],
      numero_track: ['', []],
      titulo_track: ['', []],
      control_publishing: [false, []],
      // evento
      evento: []

    });

    this.form.get('tipo').valueChanges.subscribe(tipo => {
      this.handleChangesType(tipo === 'publicacion_en_vivo');
    });

    this.sourceControl.valueChanges.subscribe(url => {
      this.otherSource = url === 'otro';
      if (this.otherSource) {
        this.otherSourceControl.valueChanges.subscribe(source => {
          this.form.patchValue({ url_manifiesto: source });
        });
      } else {
        this.form.patchValue({ url_manifiesto: url });
      }
    });
  }

  handleChangesType(isTvVivo: boolean) {
    if (isTvVivo) {
      this.isTvVivo = true;
      this.form.patchValue({ tipologia: 8 });
      // this.form.get('tipologia').disable();
    } else {
      this.isTvVivo = false;
      // this.form.get('tipologia').enable();
    }

  }

  uploadSubtitle() {
    this.pubService.getUrl(this.urlMinioPub).subscribe((response: any) => {
      const fd = new FormData();
      fd.append('File', this.selectedSubtitle);
      this.form.patchValue({ url_subtitulo: response.url_minio[1].key });
      for (const key in response.url_minio[1]) {

        fd.append(key, response.url_minio[1][key]);
      }
      this.uploadRequest = this.pubService.uploadFile(response.url_minio[0], fd).subscribe((event: any) => {
        if (event.type === HttpEventType.Response) {
          this.createPublicacion();
        }
      });
    });
  }

  selectVideoDialog($event, video: HTMLInputElement) {
    $event.preventDefault();
    video.click();
  }

  selectImagenDialog($event: MouseEvent, imagen: HTMLInputElement) {
    $event.preventDefault();
    imagen.click();
  }

  async getUrlVideo() {
    const response: any = await this.pubService.getUrl().toPromise();
    const formData = new FormData();
    formData.append('File', this.selectedVideo);
    this.urlVideo = response.url_minio[0];
    this.urlMinioPub = response.url_minio[1].key;
    this.form.patchValue({ url_manifiesto: response.url_minio[1].key });
    for (const key in response.url_minio[1]) {
      formData.append(key, response.url_minio[1][key]);
    }
    this.formData = formData;
  }

  get descargable() {
    return this.form.get('descargable').value;
  }

  async uploadVideo(event) {
    const validPrices = this.validatePrecios();
    if (this.selectedPalabras.length === 0) {
      this.chipList.errorState = true;
    } else if (!validPrices) {
      this.matSnack.open('Precio incorrecto.');
    } else if (!this.isTvVivo && !this.selectedVideo) {
      this.matSnack.open('Debe seleccionar el video.');
    } else if (!this.selectedImagen) {
      this.matSnack.open('Debe seleccionar la imagen de portada.');
    } else {
      const isValid = await this.validateAll();
      if (isValid) {
        this.pubService.validateAll(this.form.value, this.modeloSeleccionado).subscribe(resp => {
          this.createWordList();

          if (!this.isTvVivo) {
            this.uploadRequest = this.pubService.uploadFile(this.urlVideo, this.formData).subscribe(event => {
              this.uploadingFile = true;

              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              }
              if (event.type === HttpEventType.Response) {
                this.uploadingFile = false;
                this.pubService.convertirVideo(this.urlMinioPub, this.descargable).subscribe(() => {
                  this.matSnack.open('Conversión iniciada');
                });
                if (this.selectedSubtitle) {
                  this.uploadSubtitle();

                } else {
                  this.createPublicacion();
                }
              }
            });
          } else {
            if (this.selectedSubtitle) {
              this.uploadSubtitle();

            } else {
              this.createPublicacion();
            }
          }
        }, error => this.matSnack.open('Por favor compruebe el formulario, existen metadatos inválidos.', null, { duration: 3000 })
        );
      } else {
        this.matSnack.open('Por favor compruebe el formulario, existen metadatos inválidos.', null, { duration: 3000 });
      }

    }


  }

  createWordList() {
    this.form.patchValue({ palabras_claves: this.idsPalabras });
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
  }

  add($event: MatChipInputEvent) {
    if ($event.value.trim()) {
      const word = $event.value.trim();
      this.selectedPalabras.push(word);
      this.createWord(word);
      this.form.get('palabras_claves').markAsDirty();

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
  }

  createPublicacion() {
    this.form.get('precios').setValue(this.precios.filter(p => p.valor));
    this.pubService.create(this.form.value, this.modeloSeleccionado).subscribe(async (response: any) => {
      if (this.selectedPlaylist) {
        await this.playlistService.update({
          list: {
            id: this.selectedPlaylist.id,
            canal: this.selectedPlaylist.canal.id,
          },
          selected: [...this.selectedPlaylist.publicaciones.map(p => {
            return { id: p.id, pos: p.posicion };
          }), { id: response.id, pos: this.selectedPlaylist.publicaciones.length }]
        }).toPromise();
      }
      this.matSnack.open('Publicación creada correctamente.', null, { duration: 3000 });
      this.router.navigate(['/publicaciones']);

    }, e => this.handleError(e));


  }

  selectImg(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.form.patchValue({ url_imagen: image });
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedImagen = fr.result;
    };
  }

  selectImage(frame) {
    const blob = this.dataURLtoBlob(frame);
    const image = this.blobToFile(blob, 'img.jpeg');
    this.form.patchValue({ url_imagen: image });
    this.selectedImagen = frame;
  }

  public dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
  }

  async selectVideo(video: HTMLInputElement) {
    delete this.frames;
    this.selectedVideo = video.files[0];
    if (!this.form.get('nombre').value) {
      this.form.get('nombre').setValue(this.selectedVideo.name.slice(0, -4));
    }
    await this.getUrlVideo();
    this.selectedVideoBlob = this.sanitazer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.selectedVideo));
    this.frames = await VideoToFrames.getFrames(URL.createObjectURL(this.selectedVideo), 5, VideoToFramesMethod.totalFrames);
    this.frames = this.frames.map(frame => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = frame.width;
      canvas.height = frame.height;
      ctx.putImageData(frame, 0, 0);
      return canvas.toDataURL();
    });

  }

  selectImgSecundaria(imagenSecundaria: HTMLInputElement) {
    const image = this.blobToFile(imagenSecundaria.files[0], 'img.jpeg');
    this.form.patchValue({ imagen_secundaria: image });
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedImagenSecundaria = fr.result;
    };
  }

  openModalDisco($event) {
    $event.preventDefault();
    $event.stopPropagation();

    const dialogRef = this.dialog.open(AddDiscoFormComponent, {
      minWidth: 360,
      data: {
        canal: this.form.get('canal').value,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDiscos();
        this.form.patchValue({ disco: result.id });
      }
    });
  }

  async openModalPlaylist($event) {
    $event.preventDefault();
    $event.stopPropagation();
    const canales = await this.canales$.toPromise();
    const dialogRef = this.dialog.open(PlaylistNewComponent, {
      data: {
        canales
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlaylist();
        this.playlistControl.patchValue(result.id);
      }
    });
  }

  openModalTemporada($event) {
    $event.preventDefault();
    $event.stopPropagation();

    const dialogRef = this.dialog.open(AddTemporadaFormComponent, {
      data: {
        modelo: this.modeloSeleccionado,
        canal: this.form.get('canal').value,
        serie: this.form.get('serie').value
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.temporadas$ = this.temporadaService.getAll();
        this.form.get('temporada').patchValue(result.id);
      }
    });


  }

  openModalSerie($event) {
    $event.preventDefault();
    $event.stopPropagation();
    const dialogRef = this.dialog.open(AddSerieFormComponent, {
      data: { canal: this.form.get('canal').value },
      height: '80vh',
      width: '80vw',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadSeries();
      this.form.get('serie').patchValue(result.id);
      this.loadTemps(result.pelser_id);
    });
  }

  cancelUpload() {
    if (this.uploadRequest) {
      this.uploadRequest.unsubscribe();
      this.uploadingFile = false;
      this.matSnack.open('Subida del fichero cancelada', null, { duration: 3000 });
    }
  }

  selectSerie($event: MatSelectChange) {
    this.loadTemps($event.value);
  }

  validateField() {
    if (this.form.get('nombre').value) {
      this.pubService.validate(this.form.get('nombre').value).subscribe(data => {
      }, error => {
        if (error.status !== 403) {
          this.form.get('nombre').setErrors({ existe: true });
        } else {
          this.authService.logout();
        }
      });
    }
  }

  clickImgSecundaria($event, imagenSecundaria: HTMLInputElement) {
    $event.preventDefault();
    imagenSecundaria.click();
  }

  selectSubtitle(subtitulo: HTMLInputElement) {
    this.selectedSubtitle = subtitulo.files[0];
  }

  selectSubtitleDialog($event: MouseEvent, sub: HTMLInputElement) {
    $event.preventDefault();
    sub.click();
  }

  handleCancel() {
    this.cancelUpload();
    this.router.navigate(['/publicaciones']);
  }

  unselectSubtitle() {
    this.selectedSubtitle = null;
  }

  addNewPersona = async (name) => {
    const newPersona = await this.personaService.create(name).toPromise();
    this.personasList = [newPersona, ...this.personasList];
    this.filteredPersonasList = this.personasList;
    return newPersona;
  }

  searchExtraProductora($event: { term: string; items: any[] }) {
    const { term } = $event;
    if (term) {
      this.extraService.getByQuery({ nombre__wildcard: term + '*', tipo: 'productora' }).subscribe(extras => {
        this.filteredExtraProductora = extras;
      });
    } else {
      this.filteredExtraProductora = this.extrasProductora;
    }
  }

  searchExtraPremio($event: { term: string; items: any[] }) {
    const { term } = $event;
    if (term) {
      this.extraService.getByQuery({ nombre__wildcard: term + '*', tipo: 'premio' }).subscribe(extras => {
        this.filteredExtraPremio = extras;
      });
    } else {
      this.filteredExtraPremio = this.extrasPremio;
    }
  }

  addNewExtraProductora = async (name) => {
    const tipo = 'productora';
    const newExtra = await this.extraService.create({ nombre: name, tipo }).toPromise();
    this.extrasProductora = [newExtra, ...this.extrasProductora];
    this.filteredExtraProductora = this.extrasProductora;
    return newExtra;
  }

  addNewExtraPremio = (name) => {
    const tipo = 'premio';
    this.extraService.create({ nombre: name, tipo }).subscribe((newExtra: any) => {
      this.extrasPremio = [newExtra, ...this.extrasPremio];
      this.filteredExtraPremio = this.extrasPremio;
    });
  }

  searchPersona($event: { term: string; items: any[] }) {
    const { term } = $event;
    if (term) {
      this.personaService.getByQuery({ nombre__wildcard: term + '*' }).subscribe(personas => {
        this.filteredPersonasList = personas;
      });
    } else {
      this.filteredPersonasList = this.personasList;
    }
  }

  toggleAddPlaylist($event: MatSlideToggleChange) {
    if (!$event.checked) {
      delete this.selectedPlaylist;
    }
    this.showPlaylist = $event.checked;
  }

  listenPlaylistControl() {
    this.playlistControl.valueChanges.subscribe(value => {
      this.selectedPlaylist = this.playlist.find(p => p.id === value);
    });
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

  public loadPersonas() {
    this.personasList = this.personaService.getAll().subscribe(personas => {
      this.personasList = personas;
      this.filteredPersonasList = this.personasList;
    });
    // this.filteredPersonasList = this.personasList;
  }

  private loadPlaylist() {
    this.playlistService.getAll({ page_size: 1000 }).subscribe((res: any) => {
      this.playlist = res.results;
      if (this.routerState) {
        this.showPlaylist = !!this.routerState?.copy.lista_reproduccion_canal;
        if (this.showPlaylist) {
          this.selectedPlaylist = this.playlist.find(p => p.id === this.routerState?.copy.lista_reproduccion_canal.id);
          if (this.selectedPlaylist) {
            this.playlistControl.setValue(this.selectedPlaylist.id);
          }

        }
      }
      this.listenPlaylistControl();

    });
    // this.filteredPersonasList = this.personasList;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.palabras.filter(item => {
      return item.palabra.toLowerCase().startsWith(filterValue);
    });
  }

  /*private loadPrecios() {
    this.precios$ = this.precioService.getAll();
  }*/

  private loadDiscos() {
    this.discoService.getAll().subscribe((results: any) => {
      this.discos = results;
    });
  }

  private loadGenres() {
    this.genres$ = this.genreService.getAllByTipo(this.tipo);
  }

  private setTipoGenero() {
    if (this.modeloSeleccionado === 'cancion' || this.modeloSeleccionado === 'videoclip' || this.modeloSeleccionado === 'audio') {
      this.tipo = 'mu';
    } else if (this.modeloSeleccionado === 'pelicula') {
      this.tipo = 'ci';
    }
  }

  private loadSeries() {
    this.series$ = this.serieService.getAll();
  }

  private loadTemps(idSerie?) {
    if (this.modeloSeleccionado === 'capitulo' || idSerie) {
      this.temporadas$ = this.temporadaService.getBySerie(idSerie);

    } else {
      this.temporadas$ = this.temporadaService.getAll();
    }
  }

  private changeRequireds() {
    switch (this.modeloSeleccionado) {
      // case 16
      case 'eventotipologia': {
        const fields = ['evento'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;
      }
      case 'capitulo': {
        const fields = ['temporada', 'numero'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;
      }
      // case 8
      case 'categoria': {
        const fields = ['autor', 'temporada', 'productora', 'pais', 'interprete', 'productor', 'ano', 'genero', 'numero', 'director', 'reparto',
          'fotografia', 'musica', 'guion', 'imagen_secundaria', 'disco', 'premio'];
        this.clearRequired(fields);
        break;
      }
      // case 19
      case 'reportaje': {
        const fields = ['autor'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;
      }
      // case 13
      case 'documental': {
        const fields = ['productora', 'pais'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;

      }
      case 'audio': {
        const fields = ['autor', 'temporada', 'productora', 'pais', 'interprete', 'productor', 'ano', 'genero', 'numero', 'director', 'reparto',
          'fotografia', 'musica', 'guion', 'imagen_secundaria', 'disco', 'premio'];
        this.clearRequired(fields);
        break;
      }
      case 'video': {
        const fields = ['interprete', 'director', 'ano', 'productor', 'genero'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;
      }
      case 'curso': {
        const fields = ['autor', 'temporada'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;

      }
      // case 2
      case 'pelicula': {
        const fields = ['director', 'ano', 'productora', 'pais', 'genero', 'premio', 'reparto', 'fotografia', 'musica', 'guion', 'imagen_secundaria'];
        this.setRequired(fields);
        this.clearRequired(fields);
        break;
      }
      case 'cancion': {
        const fields = ['sello', 'release_date', 'sale_start_date', 'pais_fonograma', 'portada', 'control_publishing', 'codigo_producto', 'numero_track', 'titulo_track', 'isrc',
          'masterights', 'invitado', 'autor', 'performer', 'publisher', 'productor_ejecutivo'];
        this.setRequired(fields);
        this.clearRequired(fields);
      }

    }
  }

  private setRequired(fields: string[]) {

    fields.forEach(f => {
      this.form.controls[f.toString()].setValidators(Validators.required);
    });
  }

  private clearRequired(fields: string[]) {
    const basics = ['tipo', 'tipologia', 'nombre', 'descripcion', 'canal', 'palabras_claves', 'precio', 'url_manifiesto', 'url_imagen'];
    const toExclude = [
      ...fields,
      ...basics
    ];
    Object.keys(this.form.controls).forEach(field => {
      if (!toExclude.some(f => f === field)) {
        this.form.controls[field].setErrors(null);
      }
    });
  }

  private handleError(error: any) {
    for (const invalidField in error.error) {
      this.form.get(invalidField).setErrors([{ required: true }]);
      this.matSnack.open('Existen errores en el formulario.');
    }
  }

  private validateAll() {
    const basics = this.form.get('nombre').valid && this.form.get('descripcion').valid && this.form.get('canal').valid;
    return new Promise(resolve => {
      switch (this.modeloSeleccionado) {
        case 'eventotipologia': {
          resolve(basics && this.form.get('evento').valid);
          break;
        }
        case 'capitulo': {
          resolve(basics && this.form.get('temporada').valid && this.form.get('numero').valid);
          break;
        }
        case 'categoria': {
          resolve(basics);
          break;
        }
        case 'reportaje': {
          resolve(basics && this.form.get('autor').valid);

          break;
        }
        case 'documental': {
          resolve(basics && this.form.get('productora').valid && this.form.get('pais').valid);
          break;

        }
        case 'audio': {
          resolve(
            basics && this.form.get('interprete').valid && this.form.get('productor').valid
            && this.form.get('ano').valid && this.form.get('pais').valid
            && this.form.get('genero').valid
            && this.form.get('disco').valid
          );
          break;
        }
        case 'videoclip': {
          /*this.setRequired(['interprete', 'director', 'sello', 'genero', 'release_date', 'sale_start_date', 'director_fotografico', 'guionista']);*/
          resolve(
            basics && this.form.get('interprete').valid && this.form.get('director').valid
            && this.form.get('ano').valid && this.form.get('productor').valid
            && this.form.get('genero').valid
            && this.form.get('sello').valid
            && this.form.get('release_date').valid
            && this.form.get('sale_start_date').valid
            && this.form.get('director_fotografico').valid
            && this.form.get('guionista').valid
          );
          break;
        }
        case 'curso': {
          resolve(
            basics && this.form.get('autor').valid && this.form.get('temporada').valid
            && this.form.get('productora').valid && this.form.get('pais').valid
          );
          break;

        }
        case 'pelicula': {
          resolve(
            basics && this.form.get('director').valid && this.form.get('premio').valid && this.form.get('ano').valid
            && this.form.get('productora').valid && this.form.get('pais').valid
            && this.form.get('genero').valid && this.form.get('reparto').valid
            && this.form.get('fotografia').valid && this.form.get('musica').valid
            && this.form.get('guion').valid && this.selectedImagenSecundaria
          );
          break;
        }
        case 'cancion': {
          resolve(
            basics && this.form.get('sello').valid && this.form.get('release_date').valid && this.form.get('sale_start_date').valid
            && this.form.get('pais_fonograma').valid && this.form.get('portada').valid
            && this.form.get('control_publishing').valid && this.form.get('codigo_producto').valid
            && this.form.get('numero_track').valid && this.form.get('titulo_track').valid
            && this.form.get('isrc').valid && this.form.get('masterights').valid
            && this.form.get('invitado').valid && this.form.get('autor').valid
            && this.form.get('performer').valid && this.form.get('publisher').valid
            && this.form.get('productor_ejecutivo').valid
          );
          break;
        }


      }
    });
  }

  private loadTvVivo() {
    this.canalesEnVivo = this.pubService.getByTipoContenido('publicacion_en_vivo');
  }

  addPrecioItem() {
    const precio: PrecioTag = {
      valor: null,
      tipo: 'reproduccion'
    };
    if (this.precios.length) {
      const tipoPrevio = this.precios[0].tipo;
      precio.tipo = tipoPrevio === 'descarga' ? 'reproduccion' : 'descarga';
    }
    this.precios.push(precio);
  }

  removePrecio(index: number) {
    this.precios.splice(index, 1);
  }

  setTipo($event: MatSelectChange, precio: PrecioTag) {
    precio.tipo = $event.value;
  }

  setValorPrecio($event: any, precio: PrecioTag) {
    precio.valor = $event.target.value;
  }

  private validatePrecios() {
    if (this.precios.length === 0) {
      return true;
    }
    return !!this.precios.filter(p => p.valor).length;
  }

  private loadEventos() {
    this.eventos$ = this.eventService.getAll().pipe(pluck('results'));
  }

  selectCanal(canal: any) {
    this.canalHasSeller = !!canal.seller;
  }
}
