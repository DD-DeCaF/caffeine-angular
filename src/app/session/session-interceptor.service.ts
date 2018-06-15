import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AppAuthService} from '../app-auth.service';
import {SessionService} from './session.service';

@Injectable()
export class SessionInterceptorService implements HttpInterceptor {
  // @matyasfodor TODO try to get the dependencies directly in the constuctor
  constructor(private injector: Injector, private appAuthService: AppAuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Removed the dependency, the browser API should be sufficient.
    // const localStorage = this.injector.get(LocalStorageService);
    // const appAuth = this.injector.get(AppAuthService);
    const session = this.injector.get(SessionService);

    const sessionJWT = localStorage.getItem('sessionJWT');
    // @matyasfodor TODO Add app auth service later!
    if (sessionJWT) {
      // if (sessionJWT && appAuthService.isTrustedURL(req.url)) {
      req = req.clone({headers: req.headers.set('Authorization', `Bearer ${sessionJWT}`)});
    }

    return next.handle(req).pipe(
      tap(
        () => {},
        response => {
          if (response.status === 401) {
            session.logout();
          }
        }
      ));
  }
}
