// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { TestBed, inject } from '@angular/core/testing';

import { BiggSearchService } from './bigg-search.service';
import {AppMaterialModule} from '../../../../../../app-material.module';
import {Reaction} from '../../../../../types';
import {HttpClientModule} from '@angular/common/http';

describe('BiggSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        HttpClientModule,
      ],
      providers: [BiggSearchService],
    });
  });

  it('should be created', inject([BiggSearchService], (service: BiggSearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should return results equal to a constant', inject([BiggSearchService], (service: BiggSearchService) => {
    const results = [
      {
        'name': 'Aspartate aminotransferase, cysteate forming',
        'model_bigg_id': 'Universal',
        'bigg_id': 'AATC',
        'organism': '',
      },
      {
        'name': 'AEP transport via diffusion extracellular to periplasm ',
        'model_bigg_id': 'Universal',
        'bigg_id': 'AEPtex',
        'organism': '',
      },
      {
        'name': '2 Aminoethyl phosphonate AEP transport via ABC system',
        'model_bigg_id': 'Universal',
        'bigg_id': 'AEPabc',
        'organism': '',
      },
    ];
    service.search('aetc').subscribe((data: Reaction[]) => {
      expect(data).toEqual(results);
    });
  }));

  it('should be an empty array', inject([BiggSearchService], (service: BiggSearchService) => {
    const results = [];
    service.search('xxxxx').subscribe((data: Reaction[]) => {
      expect(data).toEqual(results);
    });
  }));
});
