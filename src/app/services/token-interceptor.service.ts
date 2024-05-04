import { Injectable, Injector } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const loginService = this.injector.get(AuthService);
    if (loginService.isLoggedIn()) {
      if (req.url !== 'https://s3.picta.cu/picta/' && req.url !== 'https://s3.picta.cu/sub/'
        && !req.url.startsWith('https://image.tmdb.org')
        && !req.url.startsWith('https://api.opensubtitles.com')
      ) {

        const tokenizedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${loginService.getToken()}`
          }
        });

        return next.handle(tokenizedRequest).pipe(
          catchError(err => {
            if (err.status === 401 || err.status === 403) {
              loginService.logout();
            }
            return throwError(err);
          })
        );
      }

      return next.handle(req);
    } else {

      return next.handle(req);
    }

  }
}
