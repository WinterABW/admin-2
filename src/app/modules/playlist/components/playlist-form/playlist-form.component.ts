import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Canal } from '../../../../models/canal';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemporadaService } from '../../../../services/temporada.service';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-playlist-form',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.scss']
})
export class PlaylistFormComponent implements OnInit {
  @Input() canales: Canal[];
  @Input() playlist: any;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Input() operation: number
  form: FormGroup = new FormGroup({});
  pubList: any;
  filteredPubs: any;
  seriesList: any;
  filteredSeries: any;
  selectedPubs: any[] = [];
  pubsControl: UntypedFormControl = new UntypedFormControl('');
  selectedCanal = '';
  seriesControl: UntypedFormControl = new UntypedFormControl('');
  selectorControl: UntypedFormControl = new UntypedFormControl('publicacion');

  constructor(
    private fb: UntypedFormBuilder,
    private pubService: PublicationService,
    private temporadaService: TemporadaService,
    public snackbar: MatSnackBar
  ) {

  }

  loadPublicaciones() {
    this.pubService.getAll({ canal_nombre_raw: this.selectedCanal }).subscribe((pubs: any) => {
      this.pubList = pubs.results;
      this.filteredPubs = this.pubList;
    });
  }

  loadSeries() {
    this.temporadaService.getByParams({ canal_nombre_raw: this.selectedCanal }).subscribe((pubs: any) => {
      this.seriesList = pubs.results;
      this.filteredSeries = this.seriesList;
    });
  }

  searchPub($event: { term: string; items: any[] }) {
    const { term } = $event;
    if (term) {
      this.pubService.getAll({
        nombre__wildcard: term + '*',
        canal_nombre_raw: this.selectedCanal
      })
        .subscribe((pubs: any) => {
          this.filteredPubs = pubs.results;
        });
    } else {
      this.filteredPubs = this.pubList;
    }
  }

  searchSerie($event: { term: string; items: any[] }) {
    const { term } = $event;
    if (term) {
      this.temporadaService.getByParams({
        nombre__wildcard: term + '*',
        canal_nombre_raw: this.selectedCanal
      })
        .subscribe((pubs: any) => {
          this.filteredSeries = pubs.results;
        });
    } else {
      this.filteredSeries = this.seriesList;
    }
  }

  async ngOnInit() {
    this.initForm();

  }

  clickCancel() {
    this.cancel.emit();
  }

  clickSave() {
    if (this.form.valid) {
      this.save.emit({
        list: this.form.value, selected: this.selectedPubs.map((p, i) => {
          return { id: p.id, pos: i };
        })
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedPubs, event.previousIndex, event.currentIndex);
  }

  removeFromList(pub: any) {
    this.selectedPubs = this.selectedPubs.filter(p => p.id !== pub.id);
  }

  addSerie($event: {}) {
    this.pubService.getAll({ temporada_id: $event }).subscribe((data: any) => {
      const pubs = data.results;
      pubs.sort((a, b) => (a.nombre < b.nombre) ? -1 : (a.nombre > b.nombre) ? 1 : 0).forEach(pub => {
        this.add(pub);
      });
      this.seriesControl.reset();

    });
  }

  private initForm() {
    this.form = this.fb.group({
      id: [this.playlist ? this.playlist.id : ''],
      nombre: [this.playlist ? this.playlist.nombre : '', [Validators.required]],
      canal: [this.playlist ? this.playlist.canal.id : '', [Validators.required]],
      publicado: [this.playlist ? this.playlist.publicado : false, [Validators.required]],
      publicacion: [[], []],
    });
    this.form.get('canal').valueChanges.subscribe(canalId => {
      this.selectedCanal = this.canales.find(c => c.id === canalId).nombre;
      this.loadPublicaciones();
      this.loadSeries();
    });
    if (this.playlist) {
      this.selectedCanal = this.playlist.canal.nombre;
      this.loadPublicaciones();
      this.loadSeries();
      if (this.playlist.publicaciones.length) {
        this.selectedPubs = this.playlist.publicaciones;
      }
    }
  }

  add(pub) {
    if (!this.selectedPubs.some(p => p.id === pub.id)) {
      const newPub = {
        id: pub.id,
        nombre: pub.nombre,
      };
      this.selectedPubs.push(newPub);
      this.pubsControl.reset();
    } else {
      this.snackbar.open('La publicación ya existe en esta lista.');
    }
  }


}
