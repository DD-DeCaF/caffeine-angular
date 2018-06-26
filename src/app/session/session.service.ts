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
import {Subscription} from 'rxjs';
import {stringify} from 'query-string';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import {environment} from '../../environments/environment';
import {AppState} from '../store/app.reducers';
import {Logout, Login} from './store/session.actions';

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
    public token: string,
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
  public readonly GOOGLE: string = 'google';
  public readonly GITHUB: string = 'github';
  public readonly TWITTER: string = 'twitter';

  private providers: ProviderMap = {
    [this.GOOGLE]: new firebase.auth.GoogleAuthProvider(),
    [this.GITHUB]: new firebase.auth.GithubAuthProvider(),
    [this.TWITTER]: new firebase.auth.TwitterAuthProvider(),
  };

  constructor(private http: HttpClient, private store: Store<AppState>) {
    firebase.initializeApp({
      apiKey: environment.FIREBASE_API_KEY,
      authDomain: environment.FIREBASE_AUTH_DOMAIN,
      databaseURL: environment.FIREBASE_DATABASE_URL,
      projectId: environment.FIREBASE_PROJECT_ID,
      storageBucket: environment.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: environment.FIREBASE_SENDER_ID,
    });
  }

  public expired(): boolean {
    return !localStorage.getItem(REFRESH_TOKEN) || this.expires() <= new Date();
  }

  public expires(): Date {
    return new Date(JSON.parse(localStorage.getItem(REFRESH_TOKEN)).exp * 1000);
  }

  public authorizationExpired(): boolean {
    return !localStorage.getItem(AUTHORIZATION_TOKEN) || this.authorizationExpires() <= new Date();
  }

  public authorizationExpires(): Date {
    const payload = JSON.parse(atob(localStorage.getItem(AUTHORIZATION_TOKEN).split('.')[1]));
    return new Date(payload.exp * 1000);
  }


  public refresh(): Subscription {
    const refreshToken = JSON.parse(localStorage.getItem(REFRESH_TOKEN)).val;
    return this.http.post(`${environment.IAM_API}/refresh`, `refresh_token=${refreshToken}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).subscribe((response: HttpResponse<string>) => {
      localStorage.setItem(AUTHORIZATION_TOKEN, response.body);
    }, () => {
      console.log('Session: Token refresh failure');
    });
  }

  public github = () => this.signInWithSocial(this.GITHUB);
  public google = () => this.signInWithSocial(this.GOOGLE);
  public twitter = () => this.signInWithSocial(this.TWITTER);

  private signInWithSocial(providerKey: string): Promise<void | Subscription> {
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

  public authenticate(credentials: UserCredentials | FirebaseCredentials): Promise<void | Subscription> {
    const params = stringify(credentials);
    const endpoint = `/authenticate/${credentials instanceof FirebaseCredentials ? 'firebase' : 'local'}`;
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.IAM_API}${endpoint}`, params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      }).subscribe((response: AuthAPIResponse) => {
        console.log(response, 'AUTHENTICATE');
        this.store.dispatch(new Login());
        localStorage.setItem(AUTHORIZATION_TOKEN, response.jwt);
        localStorage.setItem(REFRESH_TOKEN, JSON.stringify(response.refresh_token));
        // call resolve here, no need to return anything
        resolve();
      }, (error) => {
        console.log('Authentication failed', error);
        // call reject with the error. You may want to turn it into a better format, it's better to do it here than in the component
        reject(error);
      });
    });
  }

  public invalidate(): void {
    this.logout();
  }

  public logout(next: string = null): void {
    localStorage.removeItem(AUTHORIZATION_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    this.store.dispatch(new Logout());
  }
}
