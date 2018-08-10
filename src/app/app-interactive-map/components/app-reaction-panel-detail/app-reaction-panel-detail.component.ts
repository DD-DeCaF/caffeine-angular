import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface Reaction {
  bigg_id: string;
  name: string;
  model_bigg_id: string;
  organism: string;
}

@Component({
  selector: 'app-reaction-panel-detail',
  templateUrl: './app-reaction-panel-detail.component.html',
  styleUrls: ['./app-reaction-panel-detail.component.css'],
})
export class AppReactionPanelDetailComponent implements OnInit {
  @Input() public itemsSelected: Reaction[] = [];
  @Output() itemRemoved: EventEmitter<Reaction[]> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  removeItem(reaction: Reaction): void {
    this.itemsSelected = this.itemsSelected.filter((item) => item !== reaction);
    this.itemRemoved.emit(this.itemsSelected);
  }

}
