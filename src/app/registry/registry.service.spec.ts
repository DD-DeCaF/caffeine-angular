import { TestBed, inject } from '@angular/core/testing';

import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistryService]
    });
  });

  it('Should be able to register configs', inject([RegistryService], (service: RegistryService) => {
    service.register('experiment', ['sharing', 'clipboard', 'search'], {name: 'Experiment'});
    service.register('pool', ['clipboard'], {name: 'Pool'});
    service.register('media', ['search'], {name: 'Media'});

    expect(Object.keys(service.get('clipboard'))).toEqual(['experiment', 'pool']);
    expect(Object.keys(service.get('sharing'))).toEqual(['experiment']);
    expect(Object.keys(service.get('search'))).toEqual(['experiment', 'media']);

    // duplicate registration is not allowed
    // expect(service.register('pool', ['sharing'], {'name': 'Pool'})).toThrowError(Error);
  }));
});
