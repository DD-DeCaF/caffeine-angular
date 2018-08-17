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

import {Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormControl} from '@angular/forms';
import {AppState} from '../../../../../store/app.reducers';
import {OperationDirection, Reaction} from '../../../../types';
import {OperationReaction, SetObjectiveReaction} from '../../../../store/interactive-map.actions';

@Component({
  selector: 'app-panel',
  templateUrl: './app-panel.component.html',
  styleUrls: ['./app-panel.component.scss'],
})
export class AppPanelComponent {
  @Input() public title: string;
  @Input() public type: string;
  @Input() public placeholder: string;

  public querySearch: FormControl = new FormControl();
  public reactions: Reaction[] = [{'bigg_id': 'FK', 'name': 'Fucokinase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FT', 'name': 'Trans,trans,cis-geranylgeranyl diphosphate synthase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FCI', 'name': 'L-fucose isomerase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FHL', 'name': 'Formate-hydrogen lyase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FUM', 'name': 'Fumarase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FDH', 'name': 'Formate dehydrogenase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FRD', 'name': 'FRD', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FQR', 'name': 'Cyclic Electron Flow', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FTR', 'name': 'Ferredoxin thioredoxin reductase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FBA', 'name': 'Fructose-bisphosphate aldolase', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'F4D', 'name': 'F4D', 'model_bigg_id': 'Universal', 'organism': ''},
      {'bigg_id': 'FBP', 'name': 'Fructose-bisphosphatase', 'model_bigg_id': 'Universal', 'organism': ''}];


  constructor(private store: Store<AppState>) {
    // Fake method to search when the value change.
    /*this.querySearch.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
        this.fakeApiservice.searchReactionsByQuery(data).subscribe((response) => {
          this.reactions = response;
        });
      });*/
  }

  displayFn(item: Reaction): string {
    if (item) {
      return item.bigg_id;
    }
  }
  addItem(reaction: Reaction): void {
    const typeToTarget = {
      'added': 'addedReactions',
      'knockout': 'knockoutReactions',
    };
    // Let's not add cardId, we can grab that in the effect!
    if (['added', 'knockout'].includes(this.type)) {
      this.store.dispatch(new OperationReaction({
        cardId: '',
        reactionId: reaction.bigg_id,
        operationTarget: typeToTarget[this.type],
        direction: OperationDirection.Do,
      }));
    } else {
      this.store.dispatch(new SetObjectiveReaction({
        cardId: '',
        reactionId: reaction.bigg_id,
        direction: 'max'}));
    }
    this.querySearch.reset();
  }
}
