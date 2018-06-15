import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { FlexLayoutModule } from '@angular/flex-layout';

import {AppComponent} from './app.component';
import {AppHomeComponent} from './app-home/app-home.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';
import {LoginComponent} from './app-login/app-login.component';

import {AppMaterialModule} from './app-material.module';
// import {SessionModule} from './session/session.module';
import {AppRoutingModule} from './app-routing.module';
import {SearchModule} from './search/search.module';
import {RegistryModule} from './registry/registry.module';

import {AppAuthService} from './app-auth.service';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';
import {reducers} from './store/app.reducers';
import { SessionService } from './session/session.service';

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppHomeComponent,
    AppWelcomeComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    // SessionModule,
    AppMaterialModule,
    SearchModule,
    RegistryModule,
    StoreModule.forRoot(reducers),
  ],
  providers: [
    AppAuthService,
    SessionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
