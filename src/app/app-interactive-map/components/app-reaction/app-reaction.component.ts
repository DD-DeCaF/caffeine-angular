import {Component, OnInit} from '@angular/core';
import {Reaction, Reactions} from '../../../../types/custom_types';

@Component({
  selector: 'app-reaction',
  templateUrl: './app-reaction.component.html',
  styleUrls: ['./app-reaction.component.scss'],
})
export class AppReactionComponent implements OnInit {
  public itemsSelected: Reactions = {
    added: [],
    removed: [],
    objective: {
      reaction: {
        bigg_id: null,
        name: null,
        model_bigg_id: null,
        organism: null,
        },
      direction: null,
    },
    changed: [],
  };
  public itemRemoved: Reaction;
  constructor() { }

  ngOnInit(): void {
  }

  onItemSelected(reactions: Reactions): void {
    this.itemsSelected = reactions;
  }

  removeItem(reaction: Reaction): void {
    this.itemRemoved = reaction;
  }

}
