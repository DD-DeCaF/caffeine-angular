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
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import {AddedReaction, BiggSearch, Reaction} from '../../../../../types';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BiggSearchService {

  constructor(private http: HttpClient) {}

  search(query: string): Observable<Reaction[]> {
    const apiURL = `${environment.apis.bigg}/search?query=${query}&search_type=reactions`;
    return this.http.get(apiURL).pipe(map((data: BiggSearch) => data.results));
  }

  getDetails(item: Reaction): Observable<AddedReaction> {
    const apiURL = `${environment.apis.bigg}/${item.model_bigg_id.toLowerCase()}/reactions/${item.bigg_id}`;
    return this.http.get(apiURL).pipe(map((reaction: AddedReaction) => this.processReaction(reaction)));
  }

  processReaction(reaction: AddedReaction): AddedReaction {
    const patt_compartment = new RegExp(/_\w(?=[^_\w]*$)/);
    let metanetx_id: string;
    try {
      metanetx_id = reaction.database_links['MetaNetX (MNX) Equation'][0].id;
    } catch (e) {
      metanetx_id = '';
    }

    const metabolites_to_add = reaction.metabolites.map((m) => {
      return {
        id: patt_compartment.test(m.bigg_id) ? m.bigg_id.replace(patt_compartment, '_c') : m.bigg_id + '_c',
        compartment: m.compartment_bigg_id,
        name: m.name,
        charge: m.stoichiometry,
        formula: '',
        annotation: {},
      };
    });

    const metabolites = Object.assign({}, ...reaction.metabolites.map((m) => {
      return {
        [patt_compartment.test(m.bigg_id) ? m.bigg_id.replace(patt_compartment, '_c') : m.bigg_id + '_c']: m.stoichiometry,
      };
    }));
    return {
      ...reaction,
      reaction_string: <string> reaction.reaction_string.replace('&#8652;', '<=>'),
      metabolites,
      metabolites_to_add,
      metanetx_id,
    };

  }
}
