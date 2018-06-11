import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppHomeComponent} from './app-home/app-home.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';

import {AppMaterialModule} from './app-material.module';
// import {SessionModule} from './session/session.module';
import {AppRoutingModule} from './app-routing.module';
import {SearchModule} from './search/search.module';
import {RegistryModule} from './registry/registry.module';

import {AppAuthService} from './app-auth.service';
import {AppToolbarComponent} from './app-toolbar/app-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppHomeComponent,
    AppWelcomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // SessionModule,
    AppMaterialModule,
    SearchModule,
    RegistryModule,
  ],
  providers: [AppAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
