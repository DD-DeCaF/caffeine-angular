import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Reaction} from '../../../../types/custom_types';

@Component({
  selector: 'app-reaction-panel-detail',
  templateUrl: './app-reaction-panel-detail.component.html',
  styleUrls: ['./app-reaction-panel-detail.component.scss'],
})
export class AppReactionPanelDetailComponent implements OnInit, OnChanges {
  @Input() public itemsSelected: Reaction[] = [];
  @Input() public type: string;
  @Output() itemRemoved: EventEmitter<Reaction> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  removeItem(reaction: Reaction): void {
    this.itemsSelected = this.itemsSelected.filter((item) => item !== reaction);
    this.itemRemoved.emit(reaction);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const itemsSelected: SimpleChange = changes.itemsSelected;
    this.itemsSelected = itemsSelected.currentValue;
  }

}
