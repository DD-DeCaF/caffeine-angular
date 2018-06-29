import { TestBed, inject } from '@angular/core/testing';

import { AppAuthService } from './app-auth.service';
import {AppModule} from './app.module';
import {APP_BASE_HREF} from '@angular/common';

describe('AppAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppAuthService,
        {provide: APP_BASE_HREF, useValue: 'http://api-staging.dd-decaf.eu/iam'},
      ],
      imports: [AppModule],
    });
  });

 it('should trust API URL', inject([AppAuthService], (service: AppAuthService) => {
   expect(
     service.isTrustedURL('https://api-staging.dd-decaf.eu/iam/'),
   ).toEqual(true);

 }));

  it('should trust sub urls from API', inject([AppAuthService], (service: AppAuthService) => {
    expect(
      service.isTrustedURL('https://api-staging.dd-decaf.eu/iam/authenticate/firebase'),
    ).toEqual(true);

  }));
});
