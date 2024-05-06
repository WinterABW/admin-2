import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {CanalService} from 'src/app/services/canal.service';
import {debounceTime, distinctUntilChanged, retry, startWith, switchMap} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {PalabrasClavesService} from '../../../../services/palabras-claves.service';
import {UsuariosService} from '../../../../services/user.service';
import {LoaderService} from '../../../../services/loader.service';
import {AuthService} from '../../../../services/auth.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan.model';

@Component({
  selector: 'app-canal-add',
  templateUrl: './canal-add.component.html',
  styleUrls: ['./canal-add.component.scss']
})
export class CanalAddComponent implements OnInit {


  sellers: any [];
  usersPropietarioFiltrados: Observable<any>;
  @ViewChild('chipPropietario', {static: true}) chipPropietario;

  form: UntypedFormGroup;

  selectedPortada: string | ArrayBuffer;

  selectedAvatar: string | ArrayBuffer;
  selectedPalabras = [];
  selectedUsuarios = [];
  palabrasFiltradas: Observable<any>;
  usersFiltrados: Observable<any>;
  propietarioControl = new UntypedFormControl();
  @ViewChild('palabrasInput', {static: true}) palabrasInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList', {static: true}) chipList;
  @ViewChild('chipListUser', {static: true}) chipListUser;
  selectedPropietario: any;
  palabrasCtrl = new UntypedFormControl();
  usersCtrl = new UntypedFormControl();
  sellerControl = new UntypedFormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  palabras;
  usuarios;
  wordsIds = [];
  usersIds = [];
  filteredSellers: any [];
  planes$: Observable<Plan[]>;

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private canalService: CanalService,
    private palabrasClavesService: PalabrasClavesService,
    private userService: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private planService: PlanService,
    private authService: AuthService
  ) {
    this.usuarios = this.activatedRoute.snapshot.data['users'];
    this.palabras = this.activatedRoute.snapshot.data['palabrasClaves'];
    this.sellers = this.activatedRoute.snapshot.data['sellers'];
    this.filteredSellers = this.activatedRoute.snapshot.data['sellers'];
    this.planes$ = this.planService.get({
      skipWrite: true,
      mapResponseFn: (response: any) => {
        return response.results;
      }
    });
    this.loaderService.hide();
  }

  get isAdmin() {
    return this.authService.groups.some(g => g.name === 'Administrador');
  }

  ngOnInit() {
    this.listenSellerCtrl();
    this.listenPalabraCtrl();
    this.listeUserCtrl();
    this.initForm();
  }

  async save() {
    if (this.selectedPalabras.length === 0) {
      this.chipList.errorState = true;
    }
    if (this.selectedUsuarios.length === 0) {
      this.chipListUser.errorState = true;
    }
    await this.createWordList();
    await this.createUserList();
    if (this.form.valid) {
      this.canalService.create(this.form.value).subscribe(data => {
        this.snackBar.open('Canal creado correctamente.');
        this.router.navigateByUrl('/canal');
      }, error => {
        console.log(error);
        if (error.error.hasOwnProperty('nombre')) {
          this.snackBar.open('Ya existe un canal con el nombre especificado.');
        }
      });

    }
  }

  selectPortada(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.form.patchValue({url_imagen: image});
    const fr = new FileReader();
    fr.readAsDataURL(image);
    fr.onload = () => {
      this.selectedPortada = fr.result;
    };
  }

  selectAvatar(imagen: HTMLInputElement) {
    const image = this.blobToFile(imagen.files[0], 'img.jpeg');
    this.form.patchValue({url_avatar: image});
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
  }

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
      this.form.get('palabras_claves').markAsDirty();

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
    this.usersCtrl.setValue(null);
    this.chipListUser.errorState = false;
  }

  createWordList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({palabras_claves: this.wordsIds});
      resolve();

    });
  }

  createUserList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({usuarios: this.usersIds});
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

  selectPropietario($event: MatAutocompleteSelectedEvent, userInput) {
    this.selectedPropietario = $event.option.value.username;
    this.form.patchValue({propietario: $event.option.value.id});
    this.propietarioControl.setValue('');
    this.propietarioControl.disable();
    userInput.value = '';

    this.chipPropietario.errorState = false;
  }

  listenPalabraCtrl() {
    this.palabrasFiltradas = this.palabrasCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      retry(-1),
      switchMap((palabra: string | null) => this.palabrasClavesService.getByQuery(palabra ? {palabra__wildcard: palabra + '*'} : {})));
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

  loadUsuarios() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.usuarios = response;
      this.listeUserCtrl();

    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.palabras.filter(item => item.palabra.toLowerCase().startsWith(filterValue));
  }

  private _filterUser(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.userService.getAllUsers({username__wildcard: filterValue}).subscribe();
    return this.usuarios.filter(item => item.username.toLowerCase().startsWith(filterValue));
  }

  removePropiertario() {
    delete this.selectedPropietario;
    this.propietarioControl.enable();
  }

  selectSeller({option: {value: username}}: MatAutocompleteSelectedEvent) {
    const seller = this.sellers.find(s => s.user.username === username);
    this.form.patchValue({seller: seller.user.id});
  }

  private initForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      alias: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      url_imagen: ['', [Validators.required]],
      url_avatar: ['', [Validators.required]],
      palabras_claves: [[], [Validators.required]],
      usuarios: [[], [Validators.required]],
      propietario: ['', []],
      seller: ['', []],
      planes: ['', []],
      publicado: [true, [Validators.required]],
      internacional: [false, [Validators.required]],
     /* donar: [false, [Validators.required]]*/
    });
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
