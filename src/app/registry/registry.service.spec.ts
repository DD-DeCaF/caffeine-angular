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
