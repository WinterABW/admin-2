import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, pluck, retry, startWith, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';
import { Publicacion } from '../../../../models/publicacion';
import { CanalService } from '../../../../services/canal.service';
import { AuthService } from '../../../../services/auth.service';
import { HotToastService } from "@ngneat/hot-toast";
import { PublicationService } from 'src/app/services/publication.service';
import { TipologiaService } from 'src/app/services/tipologia.service';
import { PalabrasClavesService } from 'src/app/services/palabras-claves.service';
import { TemporadaService } from 'src/app/services/temporada.service';
import { GeneroService } from 'src/app/services/genero.service';
import { SerieService } from 'src/app/services/serie.service';
import { CapituloService } from 'src/app/services/capitulo.service';
import { DiscoService } from 'src/app/services/disco.service';
import { ExtraService } from 'src/app/services/extra.service';
import { PersonaService } from 'src/app/services/persona.service';
import { EventService } from 'src/app/services/event.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { AddTemporadaFormComponent } from 'src/app/common/components/add-temporada-form/add-temporada-form.component';
import { AddSerieFormComponent } from 'src/app/common/components/add-serie-form/add-serie-form.component';
import { AddDiscoFormComponent } from 'src/app/common/components/add-disco-form/add-disco-form.component';
import { PlaylistNewComponent } from 'src/app/modules/playlist/components/playlist-new/playlist-new.component';



declare const VideoToFrames: any;
declare const VideoToFramesMethod: any;

interface PrecioTag {
  valor: number;
  tipo: 'descarga' | 'reproduccion';
}

@Component({
  selector: 'app-publication-edit',
  templateUrl: './publication-edit.component.html',
  styleUrls: ['./publication-edit.component.scss'],
})
export class PublicationEditComponent implements OnInit {
  color: ThemePalette = 'primary';
  disabled = false;
  publicado = true;
  publicacion: Publicacion;
  canales$;
  palabras;
  tipologias$;
  selectedVideo;
  uploadingFile = false;
  progress = 0;
  selectedPalabras = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('palabrasInput') palabrasInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('videoElement') videoElement: ElementRef;
  @ViewChild('chipList', { static: true }) chipList;
  palabrasCtrl = new UntypedFormControl();
  palabrasFiltradas: Observable<any>;
  precios$: Observable<any>;
  temporadas$: Observable<any>;
  genres$: Observable<any>;
  selectedImagen: any;
  filteredExtraProductora: any;
  filteredExtraPremio: any;
  uploadRequest: Subscription;
  form: UntypedFormGroup;
  modeloSeleccionado: string;
  tipo: string;
  wordsIds = [];
  player: any;
  isPlayerReady = new EventEmitter();
  years = this.getYears(new Date().getFullYear() - 1899, 1900);
  filteredYears = this.years;
  capitulos$: any;
  series$: Observable<any>;
  discos = [];
  selectedSubtitle: any;
  selectedImagenSecundaria: any;
  publicacionResolved: any;
  selectedVideoBlob: any;
  formData = new FormData();
  urlVideo: any;
  urlMinioPub: any;
  personasList: any;
  extrasPremio;
  extrasProductora;
  subChange = false;
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
  frames: any[];
  selectedPlaylist: any;
  showPlaylist: boolean;
  playlist: any[] = [];
  playlistControl = new UntypedFormControl('');
  hasPlayList: boolean;
  videoChange = false;
  eventos$: Observable<any>;

  precios: PrecioTag[] = [];
  canalHasSeller = false;

  constructor(
    private route: ActivatedRoute,
    private pubService: PublicationService,
    private canalService: CanalService,
    private palabrasClavesService: PalabrasClavesService,
    private tipologiaService: TipologiaService,
    private temporadaService: TemporadaService,
    private genreService: GeneroService,
    private cdr: ChangeDetectorRef,
    private matSnack: MatSnackBar,
    private hotToastService: HotToastService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private serieService: SerieService,
    private capituloService: CapituloService,
    private discoService: DiscoService,
    private sanitazer: DomSanitizer,
    private personaService: PersonaService,
    private extraService: ExtraService,
    private playlistService: PlaylistService,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.publicacionResolved = this.route.snapshot.data['publicacion'];
    this.loadPersonas();
    this.loadExtras();
    this.loadTvVivo();
    this.loadEventos();

  }

  get isAdmin() {
    return this.authService.groups.some(g => g.name === 'Administrador');
  }

  get isJefeCanal() {
    return this.authService.groups.some(g => g.name === 'Jefe de canal');
  }

  getYears(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map(i => i + startFrom);
  }

  async ngOnInit() {
    this.loadTipologias();
    this.loadCanales();
    /*this.loadPrecios();*/
    this.loadPlaylist();
    this.publicacion = this.publicacionResolved;
    this.canalHasSeller = !!this.publicacion.canal.seller;
    this.precios = this.publicacion.precios;
    if (this.publicacion.lista_reproduccion_canal.length === 1) {
      this.hasPlayList = true;
      const { id } = this.publicacion.lista_reproduccion_canal[0];
      const res = await this.pubService.getPlaylist(id).toPromise();
      this.showPlaylist = true;
      this.selectedPlaylist = res[0];
      this.playlistControl.patchValue(this.selectedPlaylist.id);
    } else {
      this.hasPlayList = false;
      delete this.playlist;
    }
    this.isPlayerReady.emit();
    this.publicacion.canal = this.publicacionResolved.canal.id;
    this.publicado = this.publicacionResolved.publicado;
    this.selectedPalabras = this.publicacionResolved.palabraClave;
    if (this.publicacionResolved.categoria) {
      this.publicacion.tipologia = this.publicacionResolved.categoria.tipologia;
    }
    this.selectedImagen = this.publicacion.url_imagen + '_720x360';
    if (this.publicacion.url_subtitulo) {
      this.selectedSubtitle = { name: `${this.publicacion.nombre}.srt` };
    }
    this.initForm();


    this.loadTemps();
    this.loadSeries();
    this.loadCapitulos();
    // this.loadPalabrasClaves();
    this.listenPalabraCtrl();
    this.loadDiscos();
  }

  async initForm() {

    if (this.publicacion.categoria.tipologia) {
      switch (this.publicacion.categoria.tipologia.modelo) {
        case 'eventotipologia': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: ['', []],
            genero: ['', []],
            autor: ['', []],
            temporada: ['', []],
            productora: ['', []],
            director: ['', []],
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
            serie: ['', []],
            disco: ['', []],
            publicado: [this.publicacion.publicado, []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: [this.publicacion.categoria.eventotipologia?.evento.id, []]

          });
          break;
        }
        case 'categoria': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: ['', []],
            genero: ['', []],
            autor: ['', []],
            temporada: ['', []],
            productora: ['', []],
            director: ['', []],
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
            serie: ['', []],
            disco: ['', []],
            publicado: [this.publicacion.publicado, []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]


          });
          break;
        }
        case 'pelicula': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: [this.publicacion.categoria.pelicula.ano, []],
            pais: [this.publicacion.categoria.pelicula.pais, []],
            genero: [this.publicacion.categoria.pelicula.genero.map(i => i.id), []],
            autor: ['', []],
            temporada: ['', []],
            productora: [this.publicacion.categoria.pelicula.productora, []],
            director: [this.publicacion.categoria.pelicula.director, []],
            director_fotografico: ['', []],
            director_arte: ['', []],
            director_artistico: ['', []],
            release_date: ['', []],
            guionista: ['', []],
            sale_start_date: ['', []],
            sello: ['', []],
            premio: [this.publicacion.categoria.pelicula.premio, []],
            reparto: [this.publicacion.categoria.pelicula.reparto, []],
            fotografia: [this.publicacion.categoria.pelicula.fotografia, []],
            musica: [this.publicacion.categoria.pelicula.musica, []],
            guion: [this.publicacion.categoria.pelicula.guion, []],
            imagen_secundaria: [this.publicacion.categoria.pelicula.imagen_secundaria, []],
            numero: ['', []],
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]


          });
          this.selectedImagenSecundaria = this.publicacion.categoria.pelicula.imagen_secundaria + '_300x180';
          break;
        }
        case 'audio': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: ['', []],
            genero: ['', []],
            autor: [this.publicacion.categoria.audio.autor, []],
            temporada: ['', []],
            productora: ['', []],
            director: ['', []],
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
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]


          });
          break;
        }
        case 'curso': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: ['', []],
            genero: ['', []],
            autor: [this.publicacion.categoria.curso.autor, []],
            temporada: [this.publicacion.categoria.curso.temporada.id, []],
            productora: ['', []],
            director: ['', []],
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
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]

          });
          break;
        }
        case 'documental': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: [this.publicacion.categoria.documental.pais, []],
            genero: ['', []],
            autor: ['', []],
            temporada: ['', []],
            productora: [this.publicacion.categoria.documental.productora, []],
            director: ['', []],
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
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]

          });
          break;
        }
        case 'reportaje': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: ['', []],
            genero: ['', []],
            autor: [this.publicacion.categoria.reportaje.autor, []],
            temporada: ['', []],
            productora: ['', []],
            director: ['', []],
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
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]

          });
          break;
        }
        case 'video': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],

            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: [this.publicacion.categoria.video.interprete, []],
            productor: [this.publicacion.categoria.video.productor, []],
            ano: [this.publicacion.categoria.video.ano, []],
            pais: ['', []],
            genero: [this.publicacion.categoria.video.genero.map(i => i.id), []],
            autor: ['', []],
            temporada: ['', []],
            productora: ['', []],
            director: [this.publicacion.categoria.video.director, []],
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
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]


          });
          break;
        }
        case 'videoclip': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],

            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: [this.publicacion.categoria.videoclip.interprete, []],
            productor: [this.publicacion.categoria.videoclip.productor, []],
            ano: [this.publicacion.categoria.videoclip.ano, []],
            pais: ['', []],
            genero: [this.publicacion.categoria.videoclip.genero.map(i => i.id), []],
            autor: ['', []],
            temporada: ['', []],
            productora: ['', []],
            director: [this.publicacion.categoria.videoclip.director, []],
            director_fotografico: [this.publicacion.categoria.videoclip.director_fotografico, []],
            director_arte: [this.publicacion.categoria.videoclip.director_arte, []],
            director_artistico: [this.publicacion.categoria.videoclip.director_artistico, []],
            release_date: [this.publicacion.categoria.videoclip.release_date, []],
            guionista: [this.publicacion.categoria.videoclip.guionista, []],
            sale_start_date: [this.publicacion.categoria.videoclip.sale_start_date, []],
            sello: [this.publicacion.categoria.videoclip.sello, []],
            portada: [this.publicacion.categoria.videoclip.portada, []],
            premio: ['', []],
            reparto: ['', []],
            fotografia: ['', []],
            musica: ['', []],
            guion: ['', []],
            imagen_secundaria: ['', []],
            numero: ['', []],
            serie: ['', []],
            disco: ['', []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            convertido: [this.publicacion.convertido, []],
            internacional: [this.publicacion.internacional, []],
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
            evento: ['', []]

          });
          break;
        }
        case 'capitulo': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],

            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: ['', []],
            productor: ['', []],
            ano: ['', []],
            pais: ['', []],
            genero: ['', []],
            autor: ['', []],
            temporada: [this.publicacion.categoria.capitulo.temporada ? this.publicacion.categoria.capitulo.temporada.id : '', []],
            serie: [this.publicacion.categoria.capitulo.temporada.serie ? this.publicacion.categoria.capitulo.temporada.serie.pelser_id : '', []],
            productora: ['', []],
            director: ['', []],
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
            numero: [this.publicacion.categoria.capitulo.numero || '', []],
            disco: ['', []],
            publicado: [this.publicacion.publicado, []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            convertido: [this.publicacion.convertido, []],
            descargable: [this.publicacion.descargable, []],
            internacional: [this.publicacion.internacional, []],
            portada: ['', []],
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
            evento: ['', []]
          });
          break;
        }
        case 'cancion': {
          this.form = this.fb.group({
            id: [this.publicacion.id, Validators.required],
            tipo: [this.publicacion.tipo, [Validators.required]],
            tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
            nombre: [this.publicacion.nombre, [Validators.required, Validators.maxLength(90)]],
            descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
            canal: [this.publicacion.canal, [Validators.required]],
            palabraClave: [this.selectedPalabras, [Validators.required]],
            precios: [[], []],
            url_imagen: [this.selectedImagen, [Validators.required]],
            url_manifiesto: [this.publicacion.url_manifiesto, []],
            url_subtitulo: [this.publicacion.url_subtitulo, []],
            interprete: [this.publicacion.categoria.cancion.interprete, []],
            productor: [this.publicacion.categoria.cancion.productor, []],
            ano: [this.publicacion.categoria.cancion.ano, []],
            pais: [this.publicacion.categoria.cancion.pais, []],
            genero: [this.publicacion.categoria.cancion.genero.map(i => i.id), []],
            autor: [this.publicacion.categoria.cancion.autor, []],
            temporada: ['', []],
            serie: ['', []],
            productora: ['', []],
            director: ['', []],
            director_fotografico: ['', []],
            director_arte: ['', []],
            director_artistico: ['', []],
            release_date: [this.publicacion.categoria.cancion.release_date, []],
            guionista: ['', []],
            sale_start_date: [this.publicacion.categoria.cancion.sale_start_date, []],
            sello: [this.publicacion.categoria.cancion.sello, []],
            premio: ['', []],
            reparto: ['', []],
            fotografia: ['', []],
            musica: ['', []],
            guion: ['', []],
            imagen_secundaria: ['', []],
            numero: ['', []],
            disco: [this.publicacion.categoria.cancion.disco, []],
            mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
            publicado: [this.publicacion.publicado, []],
            descargable: [this.publicacion.descargable, []],
            internacional: [this.publicacion.internacional, []],
            portada: [this.publicacion.categoria.cancion.portada, []],
            // cancion
            productor_ejecutivo: [this.publicacion.categoria.cancion.productor_ejecutivo, []],
            publisher: [this.publicacion.categoria.cancion.publisher, []],
            performer: [this.publicacion.categoria.cancion.performer, []],
            invitado: [this.publicacion.categoria.cancion.invitado, []],
            isrc: [this.publicacion.categoria.cancion.isrc, []],
            masterights: [this.publicacion.categoria.cancion.masterights, []],
            pais_fonograma: [this.publicacion.categoria.cancion.pais_fonograma, []],
            codigo_producto: [this.publicacion.categoria.cancion.codigo_producto, []],
            numero_track: [this.publicacion.categoria.cancion.numero_track, []],
            titulo_track: [this.publicacion.categoria.cancion.titulo_track, []],
            control_publishing: [this.publicacion.categoria.cancion.control_publishing, []],
            evento: ['', []]
          });
          break;
        }
      }
      this.form.get('id').markAsDirty();
      this.form.get('tipo').markAsDirty();
      this.form.get('tipologia').markAsDirty();
      this.loadTipologiaFromPublication();

    } else {
      this.form = this.fb.group({
        id: [this.publicacion.id, Validators.required],
        tipo: ['', [Validators.required]],
        tipologia: [this.publicacion.tipologia ? this.publicacion.tipologia.id : '', [Validators.required]],
        nombre: [this.publicacion.nombre, [Validators.required]],
        descripcion: [this.publicacion.descripcion, this.publicacion.descripcion ? [Validators.required] : []],
        canal: [this.publicacion.canal, [Validators.required]],
        palabraClave: [this.selectedPalabras, [Validators.required]],
        precios: [[], []],
        url_imagen: [this.selectedImagen, [Validators.required]],
        url_manifiesto: [this.publicacion.url_manifiesto, []],
        url_subtitulo: [this.publicacion.url_subtitulo, []],
        interprete: ['', []],
        productor: ['', []],
        ano: ['', []],
        pais: ['', []],
        genero: ['', []],
        autor: ['', []],
        temporada: ['', []],
        productora: ['', []],
        director: ['', []],
        premio: ['', []],
        reparto: ['', []],
        fotografia: ['', []],
        musica: ['', []],
        guion: ['', []],
        imagen_secundaria: ['', []],
        numero: ['', []],
        serie: ['', []],
        disco: ['', []],
        mostrar_comentarios: [this.publicacion.mostrar_comentarios, []],
        publicado: [this.publicacion.publicado, []],
        descargable: [this.publicacion.descargable, []],
        internacional: [this.publicacion.internacional, []],
        convertido: [this.publicacion.convertido, []],

      });
      this.isTvVivo = true;
      this.listenSources().then(() => {
        this.form.get('tipo').patchValue(this.publicacion.tipo);
        this.form.get('tipo').markAsDirty();
        const canalSource = this.canales.filter(c => c.url_manifiesto === this.publicacion.url_manifiesto);
        if (canalSource.length > 0) {
          this.sourceControl.patchValue(this.publicacion.url_manifiesto);
        } else {
          this.sourceControl.patchValue('otro');
          this.otherSourceControl.patchValue(this.publicacion.url_manifiesto);

        }

      });

    }
    this.form.get('id').markAsDirty();
    this.form.get('tipo').markAsDirty();
    await this.listenSources();
    this.publicacion.palabraClave_data.forEach(keyW => {
      this.wordsIds = [...this.wordsIds, keyW.id];
    });

  }

  listenSources() {
    return new Promise<void>(resolve => {

      this.form.get('tipo').valueChanges.subscribe(tipo => {
        this.handleChangesType(tipo === 'publicacion_en_vivo');
      });
      this.sourceControl.valueChanges.subscribe(url => {
        this.otherSource = url === 'otro';
        if (this.otherSource) {
          this.otherSourceControl.valueChanges.subscribe(source => {
            this.form.patchValue({ url_manifiesto: source });
            this.form.get('url_manifiesto').markAsDirty();
          });
        } else {
          this.form.patchValue({ url_manifiesto: url });
          this.form.get('url_manifiesto').markAsDirty();
        }
      });
      resolve();
    });
  }

  createWordList() {
    this.form.patchValue({ palabraClave: this.wordsIds });

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

  async selectVideo(video: HTMLInputElement) {
    this.selectedVideo = video.files[0];
    this.videoChange = true;
    await this.getUrlVideo();
    this.selectedVideoBlob = this.sanitazer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.selectedVideo));
    this.form.get('url_manifiesto').markAsDirty();
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

  async getUrlVideo() {
    const response: any = await this.pubService.getUrl().toPromise();
    const formData = new FormData();
    formData.append('File', this.selectedVideo);
    this.urlVideo = response.url_minio[0];
    this.urlMinioPub = response.url_minio[1].key;
    this.form.patchValue({ url_manifiesto: response.url_minio[1].key });
    this.form.get('url_manifiesto').markAsDirty();
    for (const key in response.url_minio[1]) {
      formData.append(key, response.url_minio[1][key]);
    }
    this.formData = formData;
  }

  remove(palabra: string): void {
    const index = this.selectedPalabras.indexOf(palabra);

    if (index >= 0) {
      this.selectedPalabras.splice(index, 1);
      this.wordsIds.splice(index, 1);

      this.form.get('palabraClave').markAsDirty();
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
      this.form.get('palabraClave').markAsDirty();

    }
    $event.input.value = '';
    this.palabrasCtrl.setValue(null);
    this.chipList.errorState = false;

  }

  selected($event: MatAutocompleteSelectedEvent) {
    this.selectedPalabras.push($event.option.value.palabra);
    this.wordsIds = [...this.wordsIds, $event.option.value.id];
    this.palabrasInput.nativeElement.value = '';
    this.palabrasCtrl.setValue(null);
    this.form.get('palabraClave').markAsDirty();
    this.chipList.errorState = false;
  }

  selectImg(imagen: HTMLInputElement) {
    const urlImagen = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.form.patchValue({ url_imagen: urlImagen });
    this.form.get('url_imagen').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(urlImagen);
    fr.onload = () => {
      delete this.selectedImagen;
      this.selectedImagen = this.sanitazer.bypassSecurityTrustUrl(fr.result as string);
      this.cdr.detectChanges();
    };

  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
  };

  clickImgSecundaria($event, imagenSecundaria: HTMLInputElement) {
    $event.preventDefault();
    imagenSecundaria.click();
  }

  selectImgSecundaria(imagenSecundaria: HTMLInputElement) {
    const image = this.blobToFile(imagenSecundaria.files[0], 'img.jpeg');
    this.form.patchValue({ imagen_secundaria: image });
    this.form.get('imagen_secundaria').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedImagenSecundaria = fr.result;
    };
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

  get descargable() {
    return this.form.get('descargable').value;
  }

  uploadVideo() {
    if (this.form.valid) {
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
          if (this.selectedSubtitle && this.subChange) {
            this.uploadSubtitle();

          } else {
            this.doUpdate(this.publicacion.id);
          }
        }
      });

    }
  }

  uploadSubtitle() {
    this.pubService.getUrl(this.form.get('url_manifiesto').value, this.videoChange).subscribe((response: any) => {
      const fd = new FormData();
      fd.append('File', this.selectedSubtitle);
      this.form.patchValue({ url_subtitulo: response.url_minio[1].key });
      this.form.get('url_subtitulo').markAsDirty();

      for (const key in response.url_minio[1]) {

        fd.append(key, response.url_minio[1][key]);
      }
      this.uploadRequest = this.pubService.uploadFile(response.url_minio[0], fd).subscribe(async (event: any) => {
        if (event.type === HttpEventType.Response) {
          await this.doUpdate(this.publicacion.id);
        }

      });

    });
  }

  async doUpdate(id) {
    const isValid = await this.validateAll();
    if (isValid) {
      const body = this.getDirtyValues(this.form);
      this.pubService.update(id, body).subscribe(async () => {
        if (this.playlistControl.dirty && this.selectedPlaylist) {
          await this.playlistService.update({
            list: {
              id: this.selectedPlaylist.id,
              canal: this.selectedPlaylist.canal.id,
            },
            selected: [...this.selectedPlaylist.publicaciones.map(p => {
              return { id: p.id, pos: p.posicion };
            }), { id: this.publicacion.id, pos: this.selectedPlaylist.publicaciones.length }]
          }).toPromise();
        }
        this.matSnack.open('Publicación actualizada correctamente.', null, { duration: 3000 });
        this.router.navigate(['/publicaciones']);
      }, e => this.handleError(e));
    } else {
      this.matSnack.open('Por favor compruebe el formulario, existen metadatos inválidos.', null, { duration: 3000 });

    }

  }

  async updateVideo(id: number) {
    if (this.form.get('palabraClave').dirty) {
      this.createWordList();
    }
    const form = this.form.value;
    form.tipologia = this.publicacion.tipologia.id;
    if (!this.form.get('imagen_secundaria').dirty) {
      delete form.imagen_secundaria;

    }
    this.pubService.validateUpdate(form).subscribe(() => {
      if (this.selectedVideo) {
        this.uploadVideo();
      } else {
        if (this.selectedSubtitle && this.subChange) {
          this.uploadSubtitle();
        } else {
          this.doUpdate(id);
        }

      }
    }, () => this.matSnack.open('Por favor compruebe el formulario, existen metadatos inválidos.', null, { duration: 3000 }));


  }

  cancelUpload() {
    this.uploadRequest.unsubscribe();
    this.uploadingFile = false;
    this.matSnack.open('Subida del fichero cancelada', null, { duration: 3000 });

  }

  selectVideoDialog($event, video: HTMLInputElement) {
    $event.preventDefault();
    video.click();
  }

  selectImagenDialog($event: MouseEvent, imagen: HTMLInputElement) {
    $event.preventDefault();
    imagen.click();
  }

  createWord(word: string) {
    this.palabrasClavesService.create(word).subscribe((newWord: any) => {
      this.wordsIds = [...this.wordsIds, newWord.id];
    });
  }

  selectSubtitle(subtitulo: HTMLInputElement) {

    this.selectedSubtitle = subtitulo.files[0];
    this.subChange = true;

  }

  selectSubtitleDialog($event: MouseEvent, sub: HTMLInputElement) {
    $event.preventDefault();
    sub.click();
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
        this.form.get('temporada').markAsDirty();

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
      if (result) {
        this.series$ = this.serieService.getAll();
        this.form.get('serie').patchValue(result.id);
        this.form.get('serie').markAsDirty();

      }
    });


  }

  openModalDisco($event) {
    $event.preventDefault();
    $event.stopPropagation();

    const dialogRef = this.dialog.open(AddDiscoFormComponent, {
      data: {
        canal: this.form.get('canal').value,

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDiscos();
        this.form.patchValue({ disco: result.id });
        this.form.get('disco').markAsDirty();

      }
    });


  }

  selectSerie($event: MatSelectChange) {
    this.loadTemps($event.value);
  }

  addNewPersona = (name) => {
    this.personaService.create(name).subscribe((newPersona: any) => {
      this.personasList = [newPersona, ...this.personasList];
      this.filteredPersonasList = this.personasList;
    });
  };

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

  handleChangesType(isTvVivo: boolean) {
    if (isTvVivo) {
      this.isTvVivo = true;
      this.form.patchValue({ tipologia: 8 });
      this.form.get('tipologia').disable();
    } else {
      this.isTvVivo = false;
      this.form.get('tipologia').enable();
      this.form.get('tipologia').markAsDirty();
      this.loadTipologiaFromPublication();
    }
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

  addNewExtraProductora = (name) => {
    const tipo = 'productora';
    this.extraService.create({ nombre: name, tipo }).subscribe((newExtra: any) => {
      this.extrasProductora = [newExtra, ...this.extrasProductora];
      this.filteredExtraProductora = this.extrasProductora;
    });
  };

  addNewExtraPremio = (name) => {
    const tipo = 'premio';
    this.extraService.create({ nombre: name, tipo }).subscribe((newExtra: any) => {
      this.extrasPremio = [newExtra, ...this.extrasPremio];
      this.filteredExtraPremio = this.extrasPremio;
    });
  };

  selectImage(frame) {
    const blob = this.dataURLtoBlob(frame);
    const image = this.blobToFile(blob, 'img.jpeg');
    this.form.patchValue({ url_imagen: image });
    this.form.get('url_imagen').markAsDirty();
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
  };

  listenPlaylistControl() {
    this.playlistControl.valueChanges.subscribe(value => {
      this.selectedPlaylist = this.playlist.find(p => p.id === value);

    });
  }

  toggleAddPlaylist($event: MatSlideToggleChange) {
    if (!$event.checked) {
      delete this.selectedPlaylist;
    }
    this.showPlaylist = $event.checked;
  }

  /* selectPlaylist(evt: MatSelectChange) {
     this.selectedPlaylist = evt.value;
   }*/

  async openModalPlaylist($event) {
    $event.preventDefault();
    $event.stopPropagation();
    const canales = await this.canales$.toPromise();
    const dialogRef = this.dialog.open(PlaylistNewComponent, {
      minHeight: '60vh',
      maxWidth: '50vw',
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

  loadPersonas() {
    this.personasList = this.personaService.getAll().subscribe(personas => {
      this.personasList = personas;
      this.filteredPersonasList = this.personasList;
    });
    // this.filteredPersonasList = this.personasList;
  }

  private handleError(error: any) {
    if (error.status === 500) {
      this.hotToastService.error(error.error.detail || error.error.message);
    } else {
      for (const invalidField in error.error) {
        if (this.form.get(invalidField)) {
          this.form.get(invalidField).setErrors([{ required: true }]);
          this.matSnack.open('Existen errores en el formulario.');
        }
      }

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

  private setTipoGenero() {
    if (this.modeloSeleccionado === 'videoclip' || this.modeloSeleccionado === 'video' || this.modeloSeleccionado === 'audio' || this.modeloSeleccionado === 'cancion') {
      this.tipo = 'mu';
    } else if (this.modeloSeleccionado === 'pelicula') {
      this.tipo = 'ci';
    }
  }

  private loadTemps(idSerie?) {
    if (this.modeloSeleccionado === 'capitulo' || this.publicacion.categoria.capitulo) {
      this.temporadas$ = this.temporadaService.getBySerie(idSerie || this.publicacion.categoria.capitulo.temporada.serie.pelser_id);

    } else {
      this.temporadas$ = this.temporadaService.getAll();
    }
  }

  private loadGenres() {
    this.genres$ = this.genreService.getAllByTipo(this.tipo);
  }

  private loadDiscos() {
    this.discoService.getAll().subscribe((results: any) => {
      this.discos = results;
    });
  }

  private loadSeries() {
    this.series$ = this.serieService.getAll();
  }

  private loadCapitulos() {
    this.capitulos$ = this.capituloService.getAll();
  }

  private loadTvVivo() {
    this.canalesEnVivo = this.pubService.getByTipoContenido('publicacion_en_vivo');
  }

  private loadTipologiaFromPublication() {
    if (this.publicacion.tipologia) {
      this.tipologias$.subscribe(data => {
        const tipologia = data.filter(item => item.id === this.publicacion.tipologia.id)[0];
        this.modeloSeleccionado = tipologia.modelo;
        this.setTipoGenero();
        this.loadGenres();
      });
      this.form.get('tipologia').markAsDirty();
    }
    this.form.get('tipologia').valueChanges.subscribe(id => {
      this.tipologias$.subscribe(data => {
        const tipologia = data.filter(item => item.id === id)[0];
        this.modeloSeleccionado = tipologia.modelo;
        this.setTipoGenero();
        this.loadGenres();
      });
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

  private loadPlaylist() {
    this.playlistService.getAll({ page_size: 400 }).subscribe((res: any) => {
      this.playlist = res.results;
      this.listenPlaylistControl();
    });
    // this.filteredPersonasList = this.personasList;
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
    this.form.get('precios').setValue(this.precios.filter(p => p.valor));
    this.form.get('precios').markAsDirty();

  }

  setTipo($event: MatSelectChange, precio: PrecioTag) {
    precio.tipo = $event.value;
    this.form.get('precios').setValue(this.precios.filter(p => p.valor));
    this.form.get('precios').markAsDirty();
  }

  setValorPrecio($event: any, precio: PrecioTag) {
    precio.valor = $event.target.value;
    this.form.get('precios').setValue(this.precios.filter(p => p.valor));
    this.form.get('precios').markAsDirty();
  }

  unselectSubtitle() {
    delete this.selectedSubtitle;
    this.form.patchValue({ url_subtitulo: '' });
    this.form.get('url_subtitulo').markAsDirty();
  }

  private loadEventos() {
    this.eventos$ = this.eventService.getAll().pipe(pluck('results'));
  }

  selectCanal(canal: any) {
    this.canalHasSeller = !!canal.seller;
  }
  getR(obj:string, obj2:string):boolean{
    return obj=== obj2
  }
}

