import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  durationInSeconds = 3;

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private snackBar: MatSnackBar
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    
    // const permiso = route.data?.['permiso'][0];

    if (!this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    // } else {
    //   if (permiso) {
    //     if (this.authenticationService.hasPermission(permiso)) {
    //       return true;
    //     } else {
    //       this.snackBar.open('El usuario no tiene acceso a la ruta especificada.');
    //       this.router.navigate(['/acceso-denegado']);
    //       return false;
    //     }
    //   } else {
    //     return true;
    //   }
    }
    return true
  }

  // canLoad(route: Route) {
  //   const isLogged = this.authenticationService.isLoggedIn();
  //   const permiso = route.data['permiso'][0];

  //   if (!isLogged) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   } else {
  //     if (permiso) {
  //       if (this.authenticationService.hasPermission(permiso)) {
  //         return true;
  //       } else {
  //         this.snackBar.open('El usuario no tiene acceso a la ruta especificada.');
  //         this.router.navigate(['/acceso-denegado']);
  //         return false;
  //       }
  //     } else {
  //       return true;
  //     }
  //   }
  // }

  openSnackBar(mensaje) {
    this.snackBar.open(mensaje, null, {
      duration: this.durationInSeconds * 1000
    });
  }

}