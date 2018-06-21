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

import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';
import {stringify} from 'query-string';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import {environment} from '../../environments/environment';
import {AppState} from '../store/app.reducers';
import {Logout, Signin} from './store/session.actions';
import {SessionState} from './store/session.reducers';

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

interface AuthAPIResponse {
  jwt: string;
  refresh_token: {
    val: string;
    exp: number;
  };
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
    const refreshToken = JSON.parse(localStorage.getItem(REFRESH_TOKEN)).val;
    return this.http.post(`${environment.IAM_API}/refresh`, `refresh_token=${refreshToken}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).subscribe((response) => {
      localStorage.setItem(AUTHORIZATION_TOKEN, (<any>response).data);
    }, () => {
      console.log('Session: Token refresh failure');
    });
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
        return firebase.auth().currentUser.getIdToken(true).then((idToken) => {
            const credentials = new FirebaseCredentials(result.user.uid, idToken);
            return this.authenticate(credentials);
        });
    }).catch((error) => {
        console.log('Social signing failed', error);
    });
  }

  authenticate(credentials: UserCredentials | FirebaseCredentials) {
    const params = stringify(credentials);
    const endpoint = `/authenticate/${credentials instanceof FirebaseCredentials ? 'firebase' : 'local'}`;
    return this.http.post(`${environment.IAM_API}${endpoint}`, params, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).subscribe((response: AuthAPIResponse) => {
      console.log(response);
      this.store.dispatch(new Signin());
      localStorage.setItem(AUTHORIZATION_TOKEN, response.jwt);
      localStorage.setItem(REFRESH_TOKEN, JSON.stringify(response.refresh_token));
    }, (error) => {
      console.log('Authentication failed', error);
    });
  }

  invalidate(): void {
    this.logout();
  }

  logout(next: string = null): void {
    localStorage.removeItem(AUTHORIZATION_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    this.store.dispatch(new Logout());
  }
}
