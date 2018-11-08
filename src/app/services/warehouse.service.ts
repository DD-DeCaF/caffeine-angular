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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as types from '../app-interactive-map/types';
import {Design, Product} from '../app-design-tool/types';
import {environment} from '../../environments/environment';

const preferredSpecies = 'Escherichia coli';

@Injectable()
export class WarehouseService {

  constructor(
    private http: HttpClient,
  ) {}

  public static preferredSpecies(speciesList: types.Species[]): types.Species {
    return speciesList.find((species) => species.name === preferredSpecies) || speciesList[0];
  }

  getOrganisms(): Observable<types.Species[]> {
    return this.http.get<types.Species[]>(`${environment.apis.warehouse}/organisms`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apis.metabolic_ninja}/products`);
    /*const fixtures$ = Observable.create((observer) => {
      observer.next([{
        name: 'vanillin',
        id: '5',
      }, {
        name: 'menaquinol-10',
        id: 'menaquinol-10',
      }, {
        name: '2,6,10,14-tetramethylpentadecanal',
        id: '2,6,10,14-tetramethylpentadecanal',
      }, {
        name: 'alpha-N-acetylneuraminyl-(2->3)-beta-D-galactosyl-(1->3)-N-acetyl-alpha-D-galactosaminyl group',
        id: 'alpha-N-acetylneuraminyl-(2->3)-beta-D-galactosyl-(1->3)-N-acetyl-alpha-D-galactosaminyl group',
      }, {
        name: '3-oxododecanoyl-CoA',
        id: '3-oxododecanoyl-CoA',
      }]);
    });
    return fixtures$;*/
    // TODO:
    // return this.http.get<Job[]>(`${environment.apis.job}/jobs`);
  }
  // TODO:
  // Change it for a real function
  startDesign(design: Design): Observable<void> {
    const fixtures$ = Observable.create((observer) => {
      observer.next('OK');
    });
    return fixtures$;
  }
}
