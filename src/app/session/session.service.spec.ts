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

import { TestBed, getTestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';

import { SessionService } from './session.service';
import { AppModule } from '../app.module';
import { reducers } from '../store/app.reducers';
import { environment } from '../../environments/environment';
import { AUTHORIZATION_TOKEN } from './session.service';

class FirebaseCredentials {
  constructor(
    public uid: string,
    public token: string,
  ) {}
}

class UserCredentials {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

describe('SessionService', () => {
  let injector: TestBed;
  let service: SessionService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        HttpClientTestingModule,
        StoreModule.forRoot(reducers)],
      providers: [
        SessionService,
        {provide: APP_BASE_HREF, useValue : '/' },
      ],
    });

    injector = getTestBed();
    service = injector.get(SessionService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    injector = getTestBed();
    service = injector.get(SessionService);
    expect(service).toBeTruthy();
  });

  it('should save the auth token in local storage', async(async () => {
    injector = getTestBed();
    service = injector.get(SessionService);
    httpMock = injector.get(HttpTestingController);

    const mockResponse = {
      jwt: 'sometoken',
      refresh_token: {
        val: 'string',
        exp: 0,
      },
    };
    const mockUser = {email: 'test@test.com', password: 'pass4test'};
    const endpoint = '/authenticate/local';
    service.authenticate(mockUser).then(() => {
      expect(localStorage.getItem(AUTHORIZATION_TOKEN)).toEqual('sometoken');
    });
    const req = httpMock.expectOne(`${environment.apis.iam}${endpoint}`);
    req.flush(mockResponse);
  }));

  it('should call local auth endpoint for email based authentication', () => {
    const mockUser = new UserCredentials('test@test.com', 'pass4test');
    const endpoint = `/authenticate/${mockUser instanceof FirebaseCredentials ? 'firebase' : 'local'}`;
    expect(endpoint).toEqual('/authenticate/local');
  });

  it('should call firebase auth endpoint for social authentication', () => {
    injector = getTestBed();
    service = injector.get(SessionService);

    const mockUser = new FirebaseCredentials('1111', 'sometoken');
    const endpoint = `/authenticate/${mockUser instanceof FirebaseCredentials ? 'firebase' : 'local'}`;
    expect(endpoint).toEqual('/authenticate/firebase');
  });
});

