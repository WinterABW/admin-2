import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class UnauthGuard {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}