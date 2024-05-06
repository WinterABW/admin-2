import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredentialsService } from './credentials.service';
import { environment } from 'src/environments/environment';
declare var require: any
var CryptoJS = require("crypto-js");

const baseUrlv2=environment.baseUrlv2

const authUrl = `${environment.ip}/o/token/`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any = null;
  authUser = {
    access_token: '',
    refresh_token: ''
  };

  public userSource = new BehaviorSubject<UserModel>(this.user);
  user$ = this.userSource.asObservable();
  durationInSeconds = 3;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private credentialsService: CredentialsService
  ) {
  }

  get permissions() {
    const groups = this.credentialsService.credentials.user?.groups;
    if (groups) {
      console.log(groups
        .filter(group => group.name !== 'Usuario común')
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.permissions), []));
      
      return groups
        .filter(group => group.name !== 'Usuario común')
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.permissions), []);
    } else {
      return [];
    }
  }
  

  get groups() {
    return this.credentialsService.credentials.user.groups;
  }

  get isAdmin() {
    return this.credentialsService.credentials.user.groups.some(g => g.name === 'Administrador');
  }

  get isContador() {
    return this.credentialsService.credentials.user.groups.some(g => g.name === 'Contadores');
  }
  get isGestorSolicitud() {
    return this.credentialsService.credentials.user.groups.some(g => g.name === 'Contadores');
  }

  login(loginData) {
    const body = new FormData();
    body.append('grant_type', 'password');
    body.append('client_id', 'lBNcdmsTc5Om3N9MTP4Dy9Rnzc6eooPU4QVHVvS5');
    if (isNaN(loginData.username)) {
      body.append('username', loginData.username);
    } else {
      body.append('username', loginData.code + loginData.username);
    }
    body.append('password', loginData.password);
    return this.httpClient.post(authUrl, body);
  }

  getUserData() {
    return this.httpClient.get(`${baseUrlv2}/usuario/me2/`);
  }

  async getUserData1() {
    if (!this.user) {
      await this.httpClient.get(`${baseUrlv2}/usuario/me2/`).subscribe((user: any) => {
        this.userSource.next(user);
      });
      return this.userSource;
    } else {
      return this.user;
    }
  }

  setUserData(user) {
    const modelo: any = '8A@bIUzA9Yukz!0G'
    const test = CryptoJS.enc.Utf8.parse(modelo)
    const corona = CryptoJS.AES.decrypt(user, test, { mode: CryptoJS.mode.ECB })
    const userDecrypt = JSON.parse(corona.toString(CryptoJS.enc.Utf8))
    this.userSource.next(userDecrypt);
  }

  isLoggedIn() {
    return this.credentialsService.isAuthenticated();
  }

  getToken() {
    if (this.isLoggedIn()) {
      const { access_token } = this.credentialsService.credentials;
      return access_token;
    }
    return null
  }

  logout() {
    this.credentialsService.setCredentials(null);
    this.router.navigate(['/login']);
  }

  async isAuthorized(permiso: string) {
    let response;
    this.userSource.subscribe((res: any) => {
      if (res) {
        response = this.checkUser(res.groups, permiso);
      }
    });
    return response;
  }

  canLogin() {
    return this.hasPermission('login_admin_usuario');
  }

  hasPermission(permission: string) {
    return this.permissions.findIndex(permiso => permiso.codename === permission) >= 0;
  }

  openSnackBar(mensaje) {
    this.snackBar.open(mensaje, null, {
      duration: this.durationInSeconds * 1000
    });
  }

  isDrawable(permiso: string) {
    let response = false;
    this.userSource.subscribe((res: any) => {
      if (res) {
        response = this.checkUser(res.groups, permiso);
      }
    });
    return response;
  }

  checkUser(grupos: any, permiso: any) {
    let permisos = [];
    let access: boolean = false;
    if (grupos.length == 2) {
      if (grupos[0].name == 'Usuario común') {
        permisos = grupos[1].permissions;
      } else {
        permisos = grupos[0].permissions;
      }
    }
    if (permisos) {
      for (var i = 0, len = permisos.length; i < len; i++) {
        if (permisos[i].codename == permiso) {
          access = true;
        }
      }
    }
    return access;
  }

}
