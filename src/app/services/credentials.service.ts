import { Injectable } from '@angular/core';
declare var require: any
var CryptoJS = require("crypto-js");
export interface Credentials {
  user?: any;
  access_token: string;
  refresh_token?: string;
}

const credentialsKey = 'credentials';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  constructor() {
    const savedCredentials = localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      try {
        this._credentials = JSON.parse(savedCredentials);

      } catch (e) {
        this.setCredentials(null);
      }
    }
  }

  private _credentials: Credentials | null = null;

  get credentials(): Credentials | null {
    if (this._credentials) {
      if(this._credentials.user){
      let credentials = Object.assign({}, this._credentials)
      const modelo: any = '8A@bIUzA9Yukz!0G'
      const test = CryptoJS.enc.Utf8.parse(modelo)
      const corona = CryptoJS.AES.decrypt(credentials.user, test, { mode: CryptoJS.mode.ECB })
      const user = JSON.parse(corona.toString(CryptoJS.enc.Utf8))
      credentials.user = user
      return credentials;
      }
      return this._credentials
    }
    return null
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      localStorage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(credentialsKey);
    }
  }
}
