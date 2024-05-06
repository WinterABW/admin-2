import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, retry, startWith, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {CanalService} from 'src/app/services/canal.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {PalabrasClavesService} from '../../../../services/palabras-claves.service';
import {UsuariosService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';
import { Plan } from 'src/app/models/plan.model';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-canal-edit',
  templateUrl: './canal-edit.component.html',
  styleUrls: ['./canal-edit.component.scss']
})
export class CanalEditComponent implements OnInit {

  form: UntypedFormGroup;
  canal;
  selectedPortada: string | ArrayBuffer;
  selectedAvatar: string | ArrayBuffer;
  selectedPalabras = [];
  palabras;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('palabrasInput') palabrasInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList', {static: true}) chipList;
  @ViewChild('chipPropietario', {static: true}) chipPropietario;
  palabrasCtrl = new UntypedFormControl();
  palabrasFiltradas: Observable<any>;
  wordsIds = [];
  selectedUsuarios = [];
  sellerControl = new UntypedFormControl('');

  filteredSellers: any [];

  usersFiltrados: Observable<any>;
  usersPropietarioFiltrados: Observable<any>;

  @ViewChild('chipListUser', {static: true}) chipListUser;

  usersCtrl = new UntypedFormControl();

  usuarios;
  sellers: any [];

  usersIds = [];
  selectedPropietario: any;
  propietarioControl = new UntypedFormControl('');
  planes$: Observable<Plan[]>;


  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private canalService: CanalService,
    private activatedRoute: ActivatedRoute,
    private palabrasClavesService: PalabrasClavesService,
    private userService: UsuariosService,
    private planService: PlanService,
    private authService: AuthService
  ) {
    this.canal = this.activatedRoute.snapshot.data['canal'];
    this.sellers = this.activatedRoute.snapshot.data['sellers'];
    this.filteredSellers = this.activatedRoute.snapshot.data['sellers'];
    this.planes$ = this.planService.get({
      skipWrite: true,
      mapResponseFn: (response: any) => {
        return response.results;
      }
    });
  }

  get isAdmin() {
    return this.authService.groups.some(g => g.name === 'Administrador');
  }

  ngOnInit() {
    this.listenSellerCtrl();
    this.listenPalabraCtrl();
    if (this.isAdmin) {
      this.loadUsuarios();
    }
    this.initForm();
    this.selectedPalabras = this.canal.palabraClave;
    this.selectedUsuarios = this.canal.usuarios_asociados.map(user => user.username);
    this.usersIds = this.canal.usuarios_asociados.map(user => user.id);
    this.selectedPortada = this.canal.url_imagen + '_400x250';
    this.selectedAvatar = this.canal.url_avatar + '_100x100';


  }

  createUserList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({usuarios_asociados: this.usersIds});
      resolve();
    });
  }

  async save() {
    if (this.form.get('palabraClave').dirty) {
      await this.createWordList();
    }
    if (this.form.get('usuarios_asociados').dirty) {
      await this.createUserList();
    }
    const body = this.getDirtyValues(this.form);
    this.canalService.update(this.canal.id, body).subscribe(res => {
      this.snackBar.open('Canal editado correctamente.');
      this.router.navigateByUrl('/canal');
    }, error => {
      this.snackBar.open('Error al editar canal.');
    });

  }

  selectPortada(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.form.patchValue({url_imagen: image});
    this.form.get('url_imagen').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedPortada = fr.result;
    };
  }

  selectAvatar(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.form.patchValue({url_avatar: image});
    this.form.get('url_avatar').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedAvatar = fr.result;
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
    return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
  };

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

  createWordList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({palabraClave: this.wordsIds});
      resolve();

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
      this.wordsIds = [...this.wordsIds, newWord.id];
    });
  }

  loadUsuarios() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.usuarios = response;
      this.listeUserCtrl();

    });
  }

  listeUserCtrl() {
    this.usersFiltrados = this.usersCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap((username: string | null) => this.userService.getAllUsers({username__wildcard: username})));
    this.usersPropietarioFiltrados = this.propietarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap((username: string | null) => this.userService.getAllUsers({username__wildcard: username})));
  }

  addUser($event: MatChipInputEvent) {
    if ($event.value.trim()) {
      const user = $event.value.trim();
      const usuario = this.usuarios.filter(u => u.username === user);
      if (usuario.length > 0) {
        this.selectedUsuarios.push(usuario[0].username);
      }
      this.form.get('usuarios_asociados').markAsDirty();

    }
    $event.input.value = '';
    this.palabrasCtrl.setValue(null);
    this.chipList.errorState = false;
  }

  selectedUser($event: MatAutocompleteSelectedEvent, userInput) {
    this.selectedUsuarios.push($event.option.value.username);
    this.usersIds.push($event.option.value.id);
    this.usersCtrl.reset();
    userInput.value = '';
    this.form.get('usuarios_asociados').markAsDirty();
    this.chipListUser.errorState = false;
  }

  removeUser(username: string): void {
    const index = this.selectedUsuarios.indexOf(username);

    if (index >= 0) {
      this.selectedUsuarios.splice(index, 1);
      this.usersIds.splice(index, 1);

      this.form.get('usuarios_asociados').markAsDirty();

    }
    if (this.selectedUsuarios.length === 0) {
      this.chipListUser.errorState = true;

    }
  }

  removePropiertario() {
    delete this.selectedPropietario;
    this.propietarioControl.enable();
    this.form.get('propietario').markAsDirty();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();


    return this.palabras.filter(item => {

      return item.palabra.toLowerCase().startsWith(filterValue);
    });
  }

  private _filterUser(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usuarios.filter(item => item.username.toLowerCase().startsWith(filterValue));
  }

  selectPropietario($event: MatAutocompleteSelectedEvent, userInput) {
    this.selectedPropietario = $event.option.value.username;
    this.form.patchValue({propietario: $event.option.value.id});
    this.form.get('propietario').markAsDirty();
    this.propietarioControl.setValue('');
    this.propietarioControl.disable();
    userInput.value = '';

    this.chipPropietario.errorState = false;
  }

  selectSeller({option: {value: username}}: MatAutocompleteSelectedEvent) {
    const seller = this.sellers.find(s => s.user.username === username);
    this.form.patchValue({seller: seller.user.id});
    this.form.get('seller').markAsDirty();
  }

  private initForm() {
    this.form = this.fb.group({
      nombre: [this.canal.nombre, [Validators.required]],
      alias: [this.canal.alias, [Validators.required]],
      descripcion: [this.canal.descripcion, [Validators.required]],
      url_imagen: [this.canal.url_imagen, [Validators.required]],
      url_avatar: [this.canal.url_avatar, [Validators.required]],
      palabraClave: ['', [Validators.required]],
      usuarios_asociados: ['', [Validators.required]],
      publicado: [this.canal.publicado, [Validators.required]],
      propietario: [this.canal.propietario.id, []],
      seller: [this.canal.seller?.id, []],
      planes: [this.canal.planes.length ? this.canal.planes.map(plan => plan.plan.id) : [] , []],
      internacional: [this.canal.internacional, [Validators.required]],
      donar: [this.canal.donar, [Validators.required]]
    });
    if (this.canal.propietario) {
      this.selectedPropietario = this.canal.propietario.username;
      this.form.get('propietario').disable();
    }
    if (this.canal.seller) {
      this.sellerControl.setValue(this.canal.seller.username);
    }
  }

  private listenSellerCtrl() {
    this.sellerControl.valueChanges.subscribe(value => {
      if (value) {
        this.filteredSellers = this.sellers.filter(s => s.user.username.toLowerCase().includes(value.toLowerCase()));
      } else {
        this.filteredSellers = this.sellers;
      }
    });
  }
}

