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
