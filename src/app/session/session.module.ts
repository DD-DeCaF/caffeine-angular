import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SessionService} from './session.service';
import {SessionInterceptorService} from './session-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
// import {AuthGuardService} from './auth-guard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    SessionService,
    // AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptorService,
      multi: true,
    }
  ]
})
export class SessionModule {
}
