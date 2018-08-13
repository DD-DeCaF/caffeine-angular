import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reaction} from '../../../../types/custom_types';

@Component({
  selector: 'app-reaction-panel-objective',
  templateUrl: './app-reaction-panel-objective.component.html',
  styleUrls: ['./app-reaction-panel-objective.component.scss'],
})
export class AppReactionPanelObjectiveComponent implements OnInit {
  @Input() public item;
  @Output() public itemRemoved: EventEmitter<Reaction> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  changeDirectionObjective(): void {
    if (this.item.direction === 'max') {
      this.item.direction = 'min';
    } else {
      this.item.direction = 'max';
    }
  }

  removeItem(reaction: Reaction): void {
    this.item.reaction = {
        bigg_id: null,
        name: null,
        model_bigg_id: null,
        organism: null,
    };
    this.item.direction = null;
    this.itemRemoved.emit(reaction);
  }
}
