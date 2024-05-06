import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, retry, startWith, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { SolicitudService } from '../../../solicitud/services/solicitud.service';
import { PalabrasClavesService } from '../../../../services/palabras-claves.service';
import { CanalService } from '../../../../services/canal.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from '../../../../services/user.service';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UtilesService } from '../../../../services/utiles.service';

@Component({
  selector: 'app-solicitud-canal-form',
  templateUrl: './solicitud-canal-form.component.html',
  styleUrls: ['./solicitud-canal-form.component.scss']
})
export class SolicitudCanalFormComponent implements OnInit {
  form: UntypedFormGroup;
  @Input() solicitud: any;
  selectedPortada: string | ArrayBuffer;

  selectedAvatar: string | ArrayBuffer;
  selectedPalabras = [];
  selectedUsuarios = [];
  palabrasFiltradas: Observable<any>;
  usersFiltrados: Observable<any>;
  @ViewChild('palabrasInput', { static: true }) palabrasInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList', { static: true }) chipList;
  @ViewChild('chipListUser', { static: true }) chipListUser;
  palabrasCtrl = new UntypedFormControl();
  usersCtrl = new UntypedFormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  palabras;
  usuarios;
  wordsIds = [];
  usersIds = [];
  @Output() saveForm = new EventEmitter();

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private canalService: CanalService,
    private palabrasClavesService: PalabrasClavesService,
    private userService: UsuariosService,
    private solicitudService: SolicitudService,
    private utilesService: UtilesService
  ) {
  }

  ngOnInit(): void {
    this.listenPalabraCtrl();
    this.initForm();
  }

  async save() {
    if (this.selectedPalabras.length === 0) {
      this.chipList.errorState = true;
    }
    await this.createWordList();
    if (this.form.valid) {
      const data = this.form.value;
      const solicitud = {
        tipo: 'creacion_canal',
        data
      };
      if (this.solicitud) {
        this.saveForm.emit(this.form.value);
      } else {
        this.saveForm.emit(solicitud);

      }


    }
  }

  selectPortada(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedPortada = fr.result;
      this.form.patchValue({ 'urlimagen': this.selectedPortada });
    };
  }

  selectAvatar(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedAvatar = fr.result;
      this.form.patchValue({ 'urlavatar': this.selectedAvatar });
    };
  }

  selectImagenAvatarDialog($event: MouseEvent, imagen: HTMLInputElement) {
    $event.preventDefault();
    imagen.click();
  }

  selectImagenPortadaDialog($event: MouseEvent, imagen: HTMLInputElement) {
    $event.preventDefault();
    imagen.click();
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
  };

  remove(palabra: string): void {
    const index = this.selectedPalabras.indexOf(palabra);

    if (index >= 0) {
      this.selectedPalabras.splice(index, 1);
      this.wordsIds.splice(index, 1);

    }
    if (this.selectedPalabras.length === 0) {
      this.chipList.errorState = true;

    }
  }

  removeUser(username: string): void {
    const index = this.selectedUsuarios.indexOf(username);

    if (index >= 0) {
      this.selectedUsuarios.splice(index, 1);
      this.usersIds.splice(index, 1);
    }
    if (this.selectedUsuarios.length === 0) {
      this.chipListUser.errorState = true;

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

  addUser($event: MatChipInputEvent) {
    const user: any = $event.value;
    if (user) {
      this.selectedUsuarios.push(user.username);
      this.usersIds.push(user.id);
    }
    this.form.get('usuarios').markAsDirty();

    $event.input.value = '';
    this.palabrasCtrl.setValue(null);
    this.chipList.errorState = false;
  }

  createWordList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({ palabraClave: this.wordsIds.toString() });
      resolve();

    });
  }

  createUserList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({ usuarios: this.usersIds });
      resolve();
    });
  }

  createWord(word: string) {
    this.palabrasClavesService.create(word).subscribe((newWord: any) => {
      this.wordsIds = [...this.wordsIds, newWord.id];
    });
  }

  selected($event: MatAutocompleteSelectedEvent) {
    this.selectedPalabras.push($event.option.value.palabra);
    this.wordsIds = [...this.wordsIds, $event.option.value.id];
    this.palabrasInput.nativeElement.value = '';
    this.palabrasCtrl.setValue(null);
    this.chipList.errorState = false;
  }

  selectedUser($event: MatAutocompleteSelectedEvent, userInput) {
    this.selectedUsuarios.push($event.option.value.username);
    this.usersIds.push($event.option.value.id);
    this.usersCtrl.setValue('');
    userInput.value = '';

    this.chipListUser.errorState = false;
  }

  listenPalabraCtrl() {
    this.palabrasFiltradas = this.palabrasCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap((palabra: string | null) => this.palabrasClavesService.getByQuery(palabra ? { palabra__wildcard: palabra + '*' } : {})));
  }

  listeUserCtrl() {
    this.usersFiltrados = this.usersCtrl.valueChanges.pipe(
      startWith(null),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap((username: string | null) => this.userService.getAllUsers({ username__wildcard: username + '*' })));
  }

  loadUsuarios() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.usuarios = response;
      this.listeUserCtrl();

    });
  }

  private async initForm() {

    this.form = this.fb.group({
      nombre: [this.solicitud ? this.solicitud.data.nombre : '', [Validators.required]],
      alias: [this.solicitud ? this.solicitud.data.alias : '', [Validators.required]],
      tipo: ['creacion_canal', [Validators.required]],
      descripcion: [this.solicitud ? this.solicitud.data.descripcion : '', [Validators.required]],
      urlimagen: [this.solicitud ? this.solicitud.data.urlimagen : '', [Validators.required]],
      urlavatar: [this.solicitud ? this.solicitud.data.urlavatar : '', [Validators.required]],
      palabraClave: [[], [Validators.required]],
      publicado: [this.solicitud ? this.solicitud.data.publicado : true, [Validators.required]],
    });
    if (this.solicitud) {
      this.selectedAvatar = this.solicitud.data.urlavatar;
      this.selectedPortada = this.solicitud.data.urlimagen;
      const ids = this.solicitud.data.palabraClave;
      this.palabrasClavesService.getByQuery({ 'id__in': ids.replace(/,/g, '__') }).subscribe(palabras => {
        this.selectedPalabras = palabras.map(p => p.palabra);
        this.wordsIds = palabras.map(p => p.id);
      });

    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.palabras.filter(item => item.palabra.toLowerCase().startsWith(filterValue));
  }

  private _filterUser(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.userService.getAllUsers({ username__wildcard: filterValue }).subscribe();
    return this.usuarios.filter(item => item.username.toLowerCase().startsWith(filterValue));
  }

}
