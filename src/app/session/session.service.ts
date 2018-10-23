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
import {AUTHORIZATION_TOKEN, REFRESH_TOKEN} from './consts';

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

const firebaseConfig = environment.firebase;
firebase.initializeApp({
  apiKey: firebaseConfig.api_key,
  authDomain: firebaseConfig.auth_domain,
  databaseURL: firebaseConfig.database_url,
  projectId: firebaseConfig.project_id,
  storageBucket: firebaseConfig.storage_bucket,
  messagingSenderId: firebaseConfig.sender_id,
});

@Injectable()
export class SessionService {
  private trustedURLs: Array<string> = environment.trustedURLs;

  private googleProvider = new firebase.auth.GoogleAuthProvider();
  private githubProvider = new firebase.auth.GithubAuthProvider();
  private twitterProvider = new firebase.auth.TwitterAuthProvider();

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) {
    this.githubProvider.addScope('user:email');
    this.googleProvider.addScope('email');
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
    return this.http.post(`${environment.apis.iam}/refresh`, `refresh_token=${refreshToken}`, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }).subscribe((response: HttpResponse<string>) => {
      localStorage.setItem(AUTHORIZATION_TOKEN, response.body);
    }, () => {
      console.log('Session: Token refresh failure');
    });
  }

  public github = () => this.signInWithSocial(this.githubProvider);
  public google = () => this.signInWithSocial(this.googleProvider);
  public twitter = () => this.signInWithSocial(this.twitterProvider);

  private signInWithSocial(provider: firebase.auth.AuthProvider): Promise<void | Subscription> {
    firebase.auth().signOut();
    return firebase.auth().signInWithPopup(provider).then((result) => {
        return firebase.auth().currentUser.getIdToken(true).then((idToken) => {
            const credentials = new FirebaseCredentials(result.user.uid, idToken);
            return this.authenticate(credentials);
        });
    }).catch((error) => {
        console.log('Social signing failed', error);
    });
  }

  public authenticate(credentials: UserCredentials | FirebaseCredentials): Promise<void> {
    const params = stringify(credentials);
    const endpoint = `/authenticate/${credentials instanceof FirebaseCredentials ? 'firebase' : 'local'}`;
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apis.iam}${endpoint}`, params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      }).subscribe((response: AuthAPIResponse) => {
        this.store.dispatch(new Login());
        localStorage.setItem(AUTHORIZATION_TOKEN, response.jwt);
        localStorage.setItem(REFRESH_TOKEN, JSON.stringify(response.refresh_token));
        resolve();
      }, (error) => {
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

  public isTrustedURL(url: string): boolean {
    return Array.from(this.trustedURLs)
      .some((trustedURL) => url.startsWith(trustedURL));
  }
}
