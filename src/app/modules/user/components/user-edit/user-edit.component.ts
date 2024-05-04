import {Component, OnInit} from '@angular/core';
import {User} from '../../../../models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuariosService} from '../../../../services/user.service';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user: User;
  userForm: UntypedFormGroup;
  selectedAvatar: any;
  grupos: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuariosService,
    private fb: UntypedFormBuilder,
    private  router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.activatedRoute.snapshot.data['user'][0];
    this.grupos = this.activatedRoute.snapshot.data["grupos"];
    this.selectedAvatar = this.user.avatar + '_300x300';
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      id: [this.user.id, [Validators.required]],
      username: [this.user.username, [Validators.required]],
      first_name: [this.user.first_name, []],
      last_name: [this.user.last_name, []],
      fecha_nacimiento: [this.user.fecha_nacimiento, [Validators.required]],
      phone_number: [this.user.phone_number?.slice(3), [Validators.required]],
      email: [this.user.email, [Validators.email]],
      groups: [this.user.groups.map(g => g.id), [Validators.required]],
      avatar: [this.user.avatar, []],
      is_superuser: [this.user.is_superuser, [Validators.required]],
      registrado: [this.user.registrado, [Validators.required]],
      is_staff: [this.user.is_staff, [Validators.required]],
      is_active: [this.user.is_active, [Validators.required]],
      baja: [this.user.baja, [Validators.required]],
    });

  }

  openSelectAvatar(inputAvatar, evt) {
    evt.preventDefault();
    inputAvatar.click();
  }

  selectAvatar(avatar: HTMLInputElement) {
    const urlImagen = this.blobToFile(avatar.files[0], 'img.jpeg');
    this.userForm.patchValue({avatar: urlImagen});
    this.userForm.get('avatar').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(urlImagen);
    fr.onload = () => {
      this.selectedAvatar = fr.result;
    };
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

  updateUser() {
    const body = this.getDirtyValues(this.userForm);
    this.userService.updateUser(this.user.id, body).subscribe(() => {
      this.matSnackBar.open('Usuario editado correctamente.');
      this.router.navigate(['usuarios']);
    });
  }
}
