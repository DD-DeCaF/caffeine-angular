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

 it('should trust any URL by default', inject([AppAuthService], (service: AppAuthService) => {
    expect(service.isTrustedURL('https://stackoverflow.com')).toEqual(false);
  }));

  it('should trust current URLs with same hostname as current one', inject([AppAuthService], (service: AppAuthService) => {
   expect(service.isTrustedURL('https://api-staging.dd-decaf.eu/iam')).toEqual(true);
   expect(service.isTrustedURL('https://api-staging.dd-decaf.eu/iam')).toEqual(true);
 }));

 it('should trust URLs which have been explicitly added', inject([AppAuthService], (service: AppAuthService) => {
   service.trustedURLs.add('https://stackoverflow.com/questions');

   expect(
     service.isTrustedURL('https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription'),
   ).toEqual(true);

   // http is not allowed because only https:// url was added
   expect(service.isTrustedURL('http://stackoverflow.com/questions')).toEqual(false);

   // Only urls starting with questions would be trusted
   expect(service.isTrustedURL('https://stackoverflow.com/users')).toEqual(false);
 }));
});
