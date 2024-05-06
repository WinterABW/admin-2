import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';import { UsuariosService } from 'src/app/services/user.service';
;

@Injectable({
  providedIn: 'root'
})
export class UsersResolverService implements Resolve<any> {

  constructor(
    private usuariosService: UsuariosService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.usuariosService.getAllUsers();
  }
}
