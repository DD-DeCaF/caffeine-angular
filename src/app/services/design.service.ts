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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HydratedCard} from '../app-interactive-map/types';
import {DesignRequest} from '../app-designs/types';

@Injectable()
export class DesignService {
  constructor(
    private http: HttpClient,
  ) {
  }

  saveDesign(card: HydratedCard): Observable<HydratedCard> {
    const design = {
      'design': {
        'constraints': card.bounds.map((reaction) => Object.assign({
          'id': reaction.reaction.id,
          'lower_bound': reaction.lowerBound,
          'upper_bound': reaction.upperBound,
        }, reaction)),
        'gene_knockouts': card.knockoutGenes,
        'reaction_knockins': card.addedReactions.map((reaction) => reaction.bigg_id),
        'reaction_knockouts': card.knockoutReactions,
      },
      'model_id': card.model_id,
      'name': card.name,
      'project_id': 7,
    };
    return this.http.post<HydratedCard>(`${environment.apis.design_storage}/designs`, design);
  }

  getDesigns(): Observable<DesignRequest[]> {
    return this.http.get<DesignRequest[]>(`${environment.apis.design_storage}/designs`);
  }
}
