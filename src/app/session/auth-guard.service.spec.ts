import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import {Router} from '@angular/router';
import {SessionService} from './session.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        {
          provide: Router,
          useClass: class {navigate = jasmine.createSpy('navigate'); }
        },
        SessionService,
        HttpClient,
        HttpHandler,
        LocalStorageService
      ]
    });
  });

  it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
