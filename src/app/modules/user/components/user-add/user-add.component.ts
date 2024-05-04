import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../../services/user.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from 'src/app/modules/pipes/custom-validators';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  user: User;
  userForm: UntypedFormGroup;
  selectedAvatar: any;
  grupos: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsuariosService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.grupos = this.activatedRoute.snapshot.data["grupos"];
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeat_password: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      email: ['', [Validators.email]],
      groups: [[1], [Validators.required]],
      avatar: [this.selectedAvatar, []],
      is_superuser: [false, [Validators.required]],
      is_staff: [false, [Validators.required]],
      is_active: [true, [Validators.required]],
      baja: [false, [Validators.required]],
    }, {
      validator: CustomValidators.passwordMatchValidator

    });

  }

  openSelectAvatar(inputAvatar, evt) {
    evt.preventDefault();
    inputAvatar.click();
  }

  selectAvatar(avatar: HTMLInputElement) {
    const urlImagen = this.blobToFile(avatar.files[0], 'img.jpeg');
    this.userForm.patchValue({ avatar: urlImagen });
    this.userForm.get('avatar').markAsDirty();
    const fr = new FileReader();
    fr.readAsDataURL(urlImagen);
    fr.onload = () => {
      this.selectedAvatar = fr.result;
    };
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() });
  };

  createUser() {
    const body = { ...this.userForm.value, country_code: '+53', name: 'asd' };
    this.userService.create(body).subscribe(() => {
      this.matSnackBar.open('Usuario creado correctamente.');
      this.router.navigate(['usuarios']);
    });
  }
}
