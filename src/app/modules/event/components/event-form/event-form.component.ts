import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { UsuariosService } from '../../../../services/user.service';
import { debounceTime, distinctUntilChanged, retry, startWith, switchMap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanalService } from 'src/app/services/canal.service';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  @Input() evento: any;
  @Output() saved = new EventEmitter();
  form: UntypedFormGroup;
  selectedUsuarios = [];
  usersIds = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  usersCtrl = new UntypedFormControl();
  @ViewChild('chipListUser', { static: true }) chipListUser;
  
  usersFiltrados: Observable<any>;
  selectedFile: File;
  usernames = [];

  canales$;
  canalHasSeller = false;
  prueba: any;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UsuariosService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private canalService: CanalService
  ) {

    if (this.route?.snapshot?.data?.['evento']) {
      this.evento = this.route.snapshot.data['evento'][0];
    }
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCanales();
    this.listeUserCtrl();
  }

  listeUserCtrl() {
    this.usersFiltrados = this.usersCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      distinctUntilChanged(),
      retry(-1),
      switchMap((username: string | null) => this.userService.getAllUsers({ username__wildcard: username })));
  }

  async save() {
    if (this.selectedUsuarios.length === 0) {
      this.chipListUser.errorState = true;
      return;
    }
    if (this.form.invalid) {
      return;
    }
    await this.createUserList();

    const event = this.form.value;
    event.usernames = this.usernames.map(u => u.Usuario);
    this.saved.emit(event);
  }

  createUserList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({ usuarios: this.usersIds });
      resolve();
    });
  }

  removeUser(username: string): void {
    const index = this.selectedUsuarios.indexOf(username);

    if (index >= 0) {
      const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmación',
          msg: '¿Está seguro que desea eliminar este usuario de la lista?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedUsuarios.splice(index, 1);
          this.usersIds.splice(index, 1);
        }
      });

    }
    if (this.selectedUsuarios.length === 0) {
      this.chipListUser.errorState = true;

    }
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

  selectedUser($event: MatAutocompleteSelectedEvent, userInput) {
    if (this.usersIds.some(id => id === $event.option.value.id)) {
      this.usersCtrl.setValue('');
      userInput.blur();
      this.snackBar.open('El usuario seleccionado ya esta asociado a este evento');

      return;
    }
    this.selectedUsuarios.push($event.option.value.username);
    this.usersIds.push($event.option.value.id);
    this.usersCtrl.setValue('');
    userInput.value = '';
    userInput.blur();
    this.snackBar.open('Usuario agregado a la lista');
    this.chipListUser.errorState = false;
  }

  selectFile($event: any) {
    this.selectedFile = $event.target.files[0];
    if (this.selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.snackBar.open('Tipo de fichero inválido. Debe seleccionar un fichero excel.');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {
        type: 'binary', cellDates: true,
        dateNF: 'dd/mm/yyyy',
        raw: false
      });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const fullExcelData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: false
      });
      fullExcelData.forEach(user => {
        const keys = Object.keys(user);
        if (keys.some(key => key === 'Usuario' && user[key]?.trim())) {
          if (!this.usernames.some(u => u.Usuario === user.Usuario)) {
            this.usernames = [
              ...this.usernames,
              user
            ];
          }
        } else {
          this.snackBar.open('Formato incorrecto.');
        }
      });
    };
    fileReader.readAsArrayBuffer(this.selectedFile);

  }

  removeUsername(index: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este usuario de la lista?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usernames.splice(index, 1);

      }
    });
  }

  private createForm() {
    this.form = this.fb.group({
      id: [this.evento?.id || null, []],
      nombre: [this.evento?.nombre || '', [Validators.required]],
      payment_type: [this.evento?.payment_type, []],
      precio: [this.evento?.precio, []],
      multisesesion: [this.evento?.multisesesion, []],
      usuarios: [[], []],
      usernames: [[], []],
      canal: ['', [Validators.required]],
    });
    if (this.evento) {
      this.selectedUsuarios = this.evento.usuarios.map(u => u.username);
      this.usersIds = this.evento.usuarios.map(u => u.id);
    }
  }

  loadCanales() {
    this.canales$ = this.canalService.getSellers({});
  }

  

  selectCanal(canal: any) {
    this.canalHasSeller = !!canal.seller;
  }
}
