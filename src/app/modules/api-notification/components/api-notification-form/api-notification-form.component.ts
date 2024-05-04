import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, retry, startWith, switchMap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UsuariosService } from '../../../../services/user.service';

@Component({
  selector: 'app-api-notification-form',
  templateUrl: './api-notification-form.component.html',
  styleUrls: ['./api-notification-form.component.scss']
})
export class ApiNotificationFormComponent implements OnInit {
  form: UntypedFormGroup;
  @Output() saveData = new EventEmitter();
  checkControl = new UntypedFormControl(false);
  selectedUsuarios = [];
  usersIds = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  usersCtrl = new UntypedFormControl();
  @ViewChild('chipListUser', { static: true }) chipListUser;
  usersFiltrados: Observable<any>;

  constructor(
    private fb: UntypedFormBuilder,
    private usuariosService: UsuariosService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.listeUserCtrl();

  }

  createUserList() {
    return new Promise<void>(resolve => {
      this.form.patchValue({ users: this.usersIds });
      resolve();
    });
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

  addUser($event: MatChipInputEvent) {
    const user: any = $event.value;
    if (user) {
      this.selectedUsuarios.push(user.username);
      this.usersIds.push(user.id);
    }
    this.form.get('users').markAsDirty();

    $event.input.value = '';
    this.usersCtrl.setValue(null);
    this.chipListUser.errorState = false;
  }

  selectedUser($event: MatAutocompleteSelectedEvent, userInput) {
    if (this.usersIds.some(id => id === $event.option.value.id)) {
      this.usersCtrl.setValue('');
      userInput.blur();
      return;
    }
    this.selectedUsuarios.push($event.option.value.username);
    this.usersIds.push($event.option.value.id);
    this.usersCtrl.setValue('');
    userInput.value = '';
    userInput.blur();

    this.chipListUser.errorState = false;
  }

  listeUserCtrl() {
    this.usersFiltrados = this.usersCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      distinctUntilChanged(),
      retry(-1),
      switchMap((username: string | null) => this.usuariosService.getAllUsers({ username__wildcard: username })));
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
    this.saveData.emit(this.form.value);
  }

  private createForm() {
    this.form = this.fb.group({
      users: [[], []],
      msg: ['', [Validators.required]],
      subject: [{
        value: '',
        disabled: true
      }, [Validators.required]],
      body: [{
        value: '',
        disabled: true
      }, [Validators.required]],
    });
    this.checkControl.valueChanges.subscribe(checked => {
      if (checked) {
        this.form.get('subject').enable();
        this.form.get('body').enable();
      } else {
        this.form.get('subject').disable();
        this.form.get('body').disable();
      }
    });
  }
}
