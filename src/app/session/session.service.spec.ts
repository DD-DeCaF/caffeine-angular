import { TestBed, inject } from '@angular/core/testing';

import { SessionService } from './session.service';
import {AppModule} from '../app.module';
import {APP_BASE_HREF} from '@angular/common';
describe('SessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // SessionService,
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
      ],
      imports: [AppModule]
    });
  });

  it('should be created', inject([SessionService], (service: SessionService) => {
    expect(service).toBeTruthy();
  }));
});
