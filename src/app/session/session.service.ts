import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';
import {stringify} from 'query-string';
import * as firebase from 'firebase/app';
import 'firebase/auth';

// import { map } from 'rxjs/operators';

// import {User} from '../app.resources';
import { environment } from '../../environments/environment';
import { AppState } from '../store/app.reducers';
import {Logout, Signin} from './store/session.actions';
import {SessionState} from './store/session.reducers';
// import json from '*.json';

const REFRESH_TOKEN = 'refreshToken';
const AUTHORIZATION_TOKEN = 'authorizationToken';

class UserCredentials {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

class FirebaseCredentials {
  constructor(
    public uid: string,
    public token: string
  ) {}
}
// TODO enforce key type somehow
interface ProviderMap {[key: string]: firebase.auth.AuthProvider; }

@Injectable()
export class SessionService {
  sessionState: Observable<SessionState>;
  readonly GOOGLE = 'google';
  readonly GITHUB = 'github';
  readonly TWITTER = 'twitter';

  providers: ProviderMap = {
    [this.GOOGLE]: new firebase.auth.GoogleAuthProvider(),
    [this.GITHUB]: new firebase.auth.GithubAuthProvider(),
    [this.TWITTER]: new firebase.auth.TwitterAuthProvider(),
  };

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.sessionState = this.store.select('session');

    firebase.initializeApp({
      apiKey: environment.FIREBASE_API_KEY,
      authDomain: environment.FIREBASE_AUTH_DOMAIN,
      databaseURL: environment.FIREBASE_DATABASE_URL,
      projectId: environment.FIREBASE_PROJECT_ID,
      storageBucket: environment.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: environment.FIREBASE_SENDER_ID
    });
  }
  // isAuthenticated(): boolean {
  //   return !this.expired();
  // }

  expired(): boolean {
    return !localStorage.getItem(REFRESH_TOKEN) || this.expires() <= new Date();
  }

  expires(): Date {
    return new Date(JSON.parse(localStorage.getItem(REFRESH_TOKEN)).exp * 1000);
  }

  authorizationExpired(): boolean {
    return !localStorage.getItem(AUTHORIZATION_TOKEN) || this.authorizationExpires() <= new Date();
  }

  authorizationExpires(): Date {
    const payload = JSON.parse(atob(localStorage.getItem(AUTHORIZATION_TOKEN).split('.')[1]));
    return new Date(payload.exp * 1000);
  }


  refresh() {
    console.log('Session: Refreshing authorization token');
    const refreshToken = JSON.parse(localStorage.getItem(REFRESH_TOKEN)).val;
    return this.http.post(`${environment.IAM_API}/refresh`, `refresh_token=${refreshToken}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).subscribe((response) => {
      console.log(response);
      console.log('Session: Token refresh successful, saving new authorization token in local storage');
      localStorage.setItem(AUTHORIZATION_TOKEN, (<any>response).data);
    }, () => {
      console.log('Session: Token refresh failure');
    });
    // .then(response => {
      // $log.info();
      // $localStorage.authorization_token = response.data;
    // }).catch(error => {
    //   $log.info(`Session: Token refresh failure`);
    //   $log.debug(error);
    // });
  }

  github = () => this.signInWithSocial(this.GITHUB);
  google = () => this.signInWithSocial(this.GOOGLE);
  twitter = () =>  this.signInWithSocial(this.TWITTER);

  private signInWithSocial(providerKey: string): Promise<any> {
    firebase.auth().signOut();
    const provider = this.providers[providerKey];
    if (provider instanceof firebase.auth.GithubAuthProvider) {
        provider.addScope('user:email');
    } else if (provider instanceof firebase.auth.GoogleAuthProvider) {
      provider.addScope('email');
    }
    return firebase.auth().signInWithPopup(provider).then((result) => {
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
            const credentials = new FirebaseCredentials(result.user.uid, idToken);
            this.authenticate(credentials);
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
  }

  // github() {
  //   this.signInWithSocial(this.GITHUB);
  // }

  // twitter() {
  //   this.signInWithSocial(this.TWITTER);
  // }

  // google() {
  //   this.signInWithSocial(this.GOOGLE);
  // }

  authenticate(credentials: UserCredentials | FirebaseCredentials) {
    const params = stringify(credentials);
    const endpoint = `/authenticate/${credentials instanceof FirebaseCredentials ? 'firebase' : 'local'}`;
    // const endpoint =  '/authenticate/firebase' : '/authenticate/local';
    return this.http.post(`${environment.IAM_API}${endpoint}`, params, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).subscribe((response) => {
      console.log(response);
      this.store.dispatch(new Signin());
      // localStorage.setItem(AUTHORIZATION_TOKEN, )
    }, () => {

    });
    // .then(response => {
    //   $localStorage.authorization_token = response.data['jwt'];
    //   $localStorage.refresh_token = response.data['refresh_token'];
    //   $rootScope.$broadcast('session:login');
    //   $rootScope.isAuthenticated = true;
    //   $log.info(`Session: Authentication successful.
    // Session expires: ${this.expires()}, authorization expires: ${this.authorizationExpires()}`);
    // }).catch(error => {
    //   $log.info(`Session: Authentication failure`);
    //   $log.debug(error);
    //   throw error;
    // });
  }

  invalidate(): void {
    // TODO we could use https://github.com/dbfannin/ngx-logger
    console.debug(`Session: Invalidating session and forcing user to re-login`);
    this.logout();
    // $state.go('login').then(() => {
    //   $mdToast.show($mdToast.simple()
    //     .theme('warn-toast')
    //     .textContent('Your session has expired. Please log in again.')
    //     .hideDelay(6000)
    //     .action('close')
    //     .position('top right'));
    // });
  }

  logout(next: string = null): void {
    localStorage.removeItem(AUTHORIZATION_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    // $rootScope.$broadcast('session:logout', {next});
    // $rootScope.isAuthenticated = false;
    this.store.dispatch(new Logout());
  }

  // login(next: string = null): void {
  //   $state.go('login');
  // }

  // isAuthenticated(): Observable<boolean> {
  //   return this.expired();
  // }

  // expired(): Observable<boolean> {
  //   this.sessionState.map((sessionState => sessionState.refresh_token))
  // }

  // get expires() {
  //   const sessionJWT = localStorage.getItem('sessionJWT');

  //   if (sessionJWT) {
  //     try {
  //       return new Date(JSON.parse(atob(sessionJWT.split('.')[0])).exp * 1000);
  //     } catch (e) {
  //       return new Date(0);
  //     }
  //   } else {
  //     return new Date(0);
  //   }
  // }

  // private get attributes() {
  //   const sessionJWT = localStorage.getItem('sessionJWT');
  //   if (sessionJWT) {
  //     try {
  //       return JSON.parse(atob(sessionJWT.split('.')[1]));
  //     } catch (e) {
  //       return {};
  //     }
  //   } else {
  //     return {};
  //   }
  // }

  // // getCurrentUser() {
  // //   if (!this.isAuthenticated()) {
  // //     return null;
  // //   }

  // //   const attrs = this.attributes;
  // //   if (attrs.userId) {
  // //     return User.fetch(attrs.userId, {cache: false});
  // //   } else {
  // //     return User.current();
  // //   }
  // // }

  // authenticate(credentials): Promise<any> {
  //   return this.http.post(`/api/auth`, credentials)
  //     .toPromise().then((response: any) => {
  //       localStorage.setItem('sessionJWT', response.token);
  //       // $rootScope.$broadcast('session:login');
  //     });
  // }

  // logout(next = null): void {
  //   localStorage.removeItem('sessionJWT');
  //   // $rootScope.$broadcast('session:logout', {next});
  // }

  // login(next = null): void {
  //   // $rootScope.$broadcast('session:logout', {next});
  // }
}
