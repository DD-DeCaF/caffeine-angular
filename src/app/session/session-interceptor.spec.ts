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

import {TestBed, inject, async} from '@angular/core/testing';
import {SessionInterceptor} from './session-interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StoreModule} from '@ngrx/store';

import {SessionService} from './session.service';
import {reducers} from '../store/app.reducers';
import {environment} from '../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

const UNTRUSTED_URL = 'https://foobar.com/';

@Injectable()
class MockDataService {
  constructor(private http: HttpClient) {}

  trustedEndpoint(): Observable<Object> {
    return this.http.get(environment.apis.iam);
  }

  untrustedEndpoint(): Observable<Object> {
    return this.http.get(UNTRUSTED_URL);
  }
}

describe(`SessionInterceptor`, () => {
  let service: MockDataService;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers),
      ],
      providers: [
        { 
          provide: Router, 
          useClass: class { navigate = jasmine.createSpy("navigate"); }
        },
        MockDataService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SessionInterceptor,
          multi: true,
        },
        SessionService,
      ],
    });

    sessionService = TestBed.get(SessionService);
    service = TestBed.get(MockDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', inject([HTTP_INTERCEPTORS], (interceptorService: SessionInterceptor) => {
    expect(interceptorService).toBeTruthy();
  }));

  xit('should add an Authorization header', async(async () => {
    service.trustedEndpoint().subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(environment.apis.iam);

    expect(httpRequest.request.headers.has('Authorization'));
    httpRequest.flush({});
  }));

  it('should not add an Authorization header to untrusted url', async(async () => {
    service.untrustedEndpoint().subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(UNTRUSTED_URL);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
    httpRequest.flush({});
  }));

  xit('should log the user out on 401', async(async (done) => {
    spyOn(sessionService, 'logout');

    service.trustedEndpoint().subscribe(null, () => { /* no-empty */});

    const httpRequest = httpMock.expectOne(environment.apis.iam);

    httpRequest.flush({}, {
      status: 401,
      statusText: 'Unauthorized',
    });
    expect(sessionService.logout).toHaveBeenCalled();
  }));
});
