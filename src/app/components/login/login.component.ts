import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserModel } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Credentials, CredentialsService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  durationInSeconds = 3;
  loginForm: UntypedFormGroup;
  user: UserModel;
  error: string;
  token: string;

  constructor(private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private credentialsService: CredentialsService,
  ) { }

  openSnackBar(mensaje) {
    this.snackBar.open(mensaje, null, {
      duration: this.durationInSeconds * 1000
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      code: ['+53', []],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loginForm.disable();
      this.authService.login(this.loginForm.value).
      subscribe((response: { access_token: string, refresh_token: string }) =>{
        this.error = '';
        console.log(response);
        const { access_token, refresh_token } = response;
        const credentials: Credentials = { access_token, refresh_token };
        console.log(credentials);

        this.credentialsService.setCredentials(credentials);
        this.authService.getUserData()
          .pipe(catchError(err => {
            this.credentialsService.setCredentials(null);
            return throwError(err);
          }))
          .subscribe((user: any) => {
            this.user = user;
            const credentialsUser: Credentials = { access_token, refresh_token, user };
            this.credentialsService.setCredentials(credentialsUser);
            if (this.authService.canLogin()) {
              this.authService.setUserData(this.user);
              this.router.navigate(['dashboard']);

            } else {
              this.authService.logout();
              this.snackBar.open('Acceso denegado.', null, {
                duration: 3000
              });
            }
          });
      }, (error) => {// Handle error
        this.loginForm.enable();
        if (error.status === 400) {
          this.openSnackBar('Usuario o contraseña inválida');
        }
        if (error.status === 401) {
          this.openSnackBar('Usuario y contraseña requeridos');
        }
        if (error.status > 400) {
          this.router.navigate(['error']);
        }
      });

    }
  }

}
