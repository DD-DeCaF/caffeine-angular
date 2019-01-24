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
import {map} from 'rxjs/operators';
import { of } from 'rxjs';
import {NewSpecies} from '../app-models/types';
import {Experiment} from '../app-interactive-map/types';

const preferredSpecies = 'Escherichia coli';

@Injectable()
export class WarehouseService {

  private products: Product[];

  constructor(
    private http: HttpClient,
  ) {}

  public static preferredSpecies(speciesList: types.Species[]): types.Species {
    return speciesList.find((species) => species.name === preferredSpecies) || speciesList[0];
  }

  getOrganisms(): Observable<types.Species[]> {
    return this.http.get<types.Species[]>(`${environment.apis.warehouse}/organisms`);
  }

  getProducts(name: string = null): Observable<Product[]> {
    return this.products ? of(this.searchProducts(name)) :
      this.http.get<Product[]>(`${environment.apis.metabolic_ninja}/products`).pipe(map((products: Product[]) =>
      this.processProducts(products)));
  }

  processProducts(products: Product[]): Product[] {
    this.products = products;
    return products.slice(0, 10);
  }

  searchProducts(name: string): Product[] {
    if (name) {
      return this.products.filter((product) => new RegExp(name.toLowerCase()).test(product.name.toLowerCase())).slice(0, 10);
    } else {
      return this.products.slice(0, 10);
    }
  }

  createOrganisms(organism: NewSpecies): Observable<NewSpecies> {
    return this.http.post<NewSpecies>(`${environment.apis.warehouse}/organisms`, organism);
  }
  // TODO:
  // Change it for a real function
  startDesign(design: Design): Observable<void> {
    const fixtures$ = Observable.create((observer) => {
      observer.next('OK');
    });
    return fixtures$;
  }

  getExperiments(): Observable<Experiment[]> {
    return this.http.get<Experiment[]>(`${environment.apis.warehouse}/experiments`);
  }
}
