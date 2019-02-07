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
import {forkJoin, Observable, of} from 'rxjs';
import {AddedReaction, DeCaF, HydratedCard} from '../app-interactive-map/types';
import {DesignRequest} from '../app-designs/types';
import {BiggSearchService} from '../app-interactive-map/components/app-reaction/components/app-panel/services/bigg-search.service';
import {flatMap} from 'rxjs/operators';
import {mapBiggReactionToCobra} from '../lib';

@Injectable()
export class DesignService {
  constructor(
    private http: HttpClient,
    private biggService: BiggSearchService,
  ) {
  }

  saveDesign(card: HydratedCard, projectId: number): Observable<{ id: number }> {
    const addedReactions = (card.methodCard === 'Pathway')
      ? card.addedReactions.map((reaction) => JSON.stringify(reaction))
      : card.addedReactions.map((reaction) => reaction.bigg_id);
    const design = {
      'design': {
        'constraints': card.bounds.map((reaction) => Object.assign({
          'id': reaction.reaction.id,
          'lower_bound': reaction.lowerBound,
          'upper_bound': reaction.upperBound,
        }, reaction)),
        'gene_knockouts': card.knockoutGenes,
        'reaction_knockins': addedReactions,
        'reaction_knockouts': card.knockoutReactions,
      },
      'model_id': card.model_id,
      'name': card.name,
      'project_id': projectId,
      'method': card.methodCard,
    };
    if (card.designId) {
      return this.http.put<{ id: number }>(`${environment.apis.design_storage}/designs/${card.designId}`, design);
    } else {
      return this.http.post<{ id: number }>(`${environment.apis.design_storage}/designs`, design);
    }
  }

  getDesigns(): Observable<DesignRequest[]> {
    return this.http.get<DesignRequest[]>(`${environment.apis.design_storage}/designs`);
  }

  getAddedReactions(design: DesignRequest): Observable<AddedReaction[]> {
    if (design.method === 'Pathway') {
      return of(design.design.reaction_knockins.map((reaction) => JSON.parse(reaction)));
    }
    const addedReactions = design.design.reaction_knockins.map((reaction) => {
      return this.biggService.search(reaction).pipe(
        flatMap((reactions: AddedReaction[]) => {
          return this.biggService.getDetails(reactions[0]);
        }));
    });

    if (addedReactions.length === 0) {
      return of([]);
    }
    return forkJoin(addedReactions);
  }

  getOperations(design: DesignRequest): DeCaF.Operation [] {
    const knockoutsReactions = design.design.reaction_knockouts.map((reaction) => Object.assign({
      data: null,
      id: reaction,
      operation: 'knockout',
      type: 'reaction',
    }));
    const knockoutsGenes = design.design.gene_knockouts.map((gene) => Object.assign({
      data: null,
      id: gene,
      operation: 'knockout',
      type: 'gene',
    }));
    const constraints = design.design.constraints.map((reaction) => Object.assign({
      data: {
        id: reaction.id,
        lower_bound: reaction.lower_bound,
        upper_bound: reaction.upper_bound,
      },
      id: reaction.id,
      operation: 'modify',
      type: 'reaction',
    }));
    const addedReactions = design.design.added_reactions.map((reaction: AddedReaction) => {
      return Object.assign({
        data: mapBiggReactionToCobra(reaction),
        id: reaction.bigg_id,
        operation: 'add',
        type: 'reaction',
      });
    });
    const operations = knockoutsReactions.concat(knockoutsGenes).concat(constraints).concat(addedReactions);
    return operations;
  }
}
