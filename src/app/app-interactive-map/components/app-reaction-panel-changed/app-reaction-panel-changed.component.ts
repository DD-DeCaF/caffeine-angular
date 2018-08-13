import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Reaction} from '../../../../types/custom_types';

@Component({
  selector: 'app-reaction-panel-changed',
  templateUrl: './app-reaction-panel-changed.component.html',
  styleUrls: ['./app-reaction-panel-changed.component.scss'],
})
export class AppReactionPanelChangedComponent implements OnInit, OnChanges {
  @Input() public itemsSelected: Reaction[] = [];
  @Input() public type: string;
  @Output() itemRemoved: EventEmitter<Reaction> = new EventEmitter();
  public clickedItem: string;
  public lowerbound: number;
  public upperbound: number;
  constructor() { }

  ngOnInit(): void {
  }

  removeItem(reaction: Reaction): void {
    this.itemsSelected = this.itemsSelected.filter((item) => item !== reaction);
    this.onResetBounds(reaction);
    this.itemRemoved.emit(reaction);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const itemsSelected: SimpleChange = changes.itemsSelected;
    this.itemsSelected = itemsSelected.currentValue;
  }

  clickedItemFunction(item): void {
    this.clickedItem = item.id;
    this.lowerbound = item.lower_bound;
    this.upperbound = item.upper_bound;
  }

  changedReactionDisplay(item): string {
    return item.id;
  }

  showItem(item, index): boolean {
    return this.clickedItem === item.id || (index === 0 && !this.clickedItem) || this.itemsSelected.length === 1;
  }

  onResetBounds(selectedReaction): void {
   console.log('ON RESET');
  }

  onApplyBounds(selectedReaction): void {
    console.log('ON APPLY');
  }


}
