import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
// import {debounceTime} from 'rxjs/operators';

export interface Reaction {
  bigg_id: string;
  name: string;
  model_bigg_id: string;
  organism: string;
}

@Component({
  selector: 'app-reaction-panel',
  templateUrl: './app-reaction-panel.component.html',
  styleUrls: ['./app-reaction-panel.component.scss'],
})
export class AppReactionPanelComponent implements OnInit {
  @Input() public title: string;
  @Input() public placeholder: string;
  public itemsSelected: Reaction[] = [];
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


  constructor() {
    // Fake method to search when the value change.
    /*this.querySearch.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
        this.fakeApiservice.searchReactionsByQuery(data).subscribe((response) => {
          this.reactions = response;
        });
      });*/
  }

  ngOnInit(): void {
  }

  displayFn(item: Reaction): string {
    if (item) {
      return item.bigg_id;
    }
  }

  addItem(reaction: Reaction): void {
    this.itemsSelected.push(reaction);
    this.querySearch.reset();

  }

  removeItem(reactions: Reaction[]): void {
    this.itemsSelected = reactions;
  }
}
