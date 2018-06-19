// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
// import {LoginModule} from './login/login.module';
// import {AuthGuardService} from './session/auth-guard.service';
import {AppHomeComponent} from './app-home/app-home.component';
import {LoginComponent} from './app-login/app-login.component';
// import {LogoutComponent} from './login/logout.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';


const appRoutes: Route[] = [
  {
    path: '',
    component: AppHomeComponent,
    children: [
      {
        path: '',
        component: AppWelcomeComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'app',
  //   component: AppHomeComponent,
  //   // canActivate: [AuthGuardService],
  //   children: [
  //     {
  //       path: '',
  //       component: AppWelcomeComponent
  //     },
  //   ]
  // },

  // {
  //   path: 'logout',
  //   component: LogoutComponent
  // },

];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    // LoginModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
