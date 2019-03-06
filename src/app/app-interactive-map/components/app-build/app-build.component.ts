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

import {Component, ViewChild, OnInit, AfterViewInit, ChangeDetectionStrategy, ElementRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import {MatButton, MatDialog, MatDialogConfig, MatSelect, MatSelectChange} from '@angular/material';
import {Store, select} from '@ngrx/store';
import {Observable, fromEvent} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import {
  SelectCard,
  NextCard,
  PreviousCard,
  SetPlayState,
  AddCard,
  DeleteCard,
  SaveDesign,
  SetMap,
  SetOperations,
  SetMethod, RenameCard,
} from '../../store/interactive-map.actions';
import * as fromInteractiveMapSelectors from '../../store/interactive-map.selectors';

import {AppState} from '../../../store/app.reducers';
import {CardType, Condition, DataResponse, DeCaF, Experiment, HydratedCard, Method} from '../../types';
import {selectNotNull} from '../../../framework-extensions';
import {getSelectedCard} from '../../store/interactive-map.selectors';
import {SelectProjectComponent} from './components/select-project/select-project.component';
import {ShowHelpComponent} from './components/show-help/show-help.component';
import {environment} from '../../../../environments/environment';
import Operation = DeCaF.Operation;

import {mapItemsByModel} from '../../store/interactive-map.selectors';
import * as types from '../../types';
import {ModelService} from '../../../services/model.service';
import {LoaderComponent} from '../loader/loader.component';
import {DesignRequest} from '../../../app-designs/types';
import {WarningSaveComponent} from './components/warning-save/warning-save.component';
import {SessionState} from './../../../session/store/session.reducers';
import { Loading } from './../loader/store/loader.actions';

@Component({
  selector: 'app-build',
  templateUrl: './app-build.component.html',
  styleUrls: ['./app-build.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBuildComponent implements OnInit, AfterViewInit {
  @ViewChild('play') playButton: MatButton;
  @ViewChild('map') mapSelector: MatSelect;
  @ViewChild('name') name: ElementRef;

  interactiveMapState: Observable<AppState>;
  public cards: HydratedCard[] = null;
  public playing: Observable<boolean>;
  public selectedProjectId: number;
  public expandedCard: HydratedCard = null;
  public selectedCard: HydratedCard = null;
  public tabIndex: number = null;
  public experiments: Observable<Experiment[]>;
  public conditions: Condition[];
  public condition: Condition;
  public experiment: Experiment;
  public queryExperiment = '';
  public queryCondition = '';
  public method: string;
  public cardType = CardType;
  public designs: DesignRequest[];
  public sessionState$: Observable<SessionState>;
  public editeName = null;
  public methods: Method[] = [
    {id: 'fba', name: 'Flux Balance Analysis (FBA)'},
    {id: 'pfba', name: 'Parsimonious FBA'},
    {id: 'fva', name: 'Flux Variability Analysis (FVA)'},
    {id: 'pfba-fva', name: 'Parsimonious FVA'},
  ];
  public selectedMap: Observable<types.MapItem>;
  public models: Observable<types.DeCaF.ModelHeader[]>;

  public mapItems: Observable<{
    modelIds: string[],
    mapsByModelId: {[key: string]: types.MapItem[] },
  }>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private http: HttpClient,
    private modelService: ModelService) {
  }

  ngOnInit(): void {
    this.store.pipe(select(fromInteractiveMapSelectors.getHydratedCards)).subscribe((cards) => this.cards = cards);
    this.playing = this.store.pipe(select((state: AppState) => state.interactiveMap.playing));
    this.experiments = this.store.pipe(select((store) => store.shared.experiments));

    this.store.pipe(select((state: AppState) => state.shared.designs)).subscribe((designs) => {
      this.designs = designs;
    });

    this.store.pipe(
      select((store) => store.shared.selectedProject)).subscribe((project) => {
      this.selectedProjectId = project ? project.id : null;
    });

    this.store.pipe(
      selectNotNull(getSelectedCard)).subscribe((card) => {
      this.selectedCard = card;
      this.method = card.method;
      this.queryExperiment = card.experiment;
      this.queryCondition = card.condition;
      if (this.expandedCard) {
        this.expandedCard = card;
      }
    });
    this.selectedMap = this.store.pipe(select((store) => store.interactiveMap.selectedMap));
    this.mapItems = this.store.pipe(select(mapItemsByModel));
    this.models = this.store.pipe(select((store) => store.shared.modelHeaders));
    this.sessionState$ = this.store.select('session');
  }

  ngAfterViewInit(): void {
    fromEvent(this.playButton._elementRef.nativeElement, 'click').pipe(
      withLatestFrom(this.playing),
    ).subscribe(([, playing]) => {
      this.store.dispatch(new SetPlayState(!playing));
    });

    this.mapSelector.selectionChange
      .pipe(
        map((change: MatSelectChange): types.MapItem => change.value),
      )
      .subscribe((mapItem: types.MapItem) => {
        this.store.dispatch(new Loading());
        this.store.dispatch(new SetMap(mapItem));
      });
  }

  public select(card: HydratedCard): void {
    this.store.dispatch(new SelectCard(card.id));
  }

  public addDesignCard(): void {
    this.store.dispatch(new AddCard(CardType.Design));
  }

  public addDataDrivenCard(): void {
    this.queryExperiment = '';
    this.queryCondition = '';
    this.store.dispatch(new AddCard(CardType.DataDriven));
  }

  public next(): void {
    this.store.dispatch(new NextCard());
  }

  public previous(): void {
    this.store.dispatch(new PreviousCard());
  }

  public delete(card: HydratedCard): void {
    this.store.dispatch(new DeleteCard(card.id));
  }

  public grow(card: HydratedCard, tabIndex: number): void {
    this.store.dispatch(new SetPlayState(false));
    this.store.dispatch(new SelectCard(card.id));
    this.expandedCard = card;
    this.tabIndex = tabIndex;
  }

  public shrink(): void {
    this.expandedCard = null;
  }

  private growthRateMeaningful(growthRate: number): boolean {
    return Math.abs(growthRate) > 1e-05;
  }

  public growthRateBackground(growthRate: number): string {
    return this.growthRateMeaningful(growthRate) ? 'white' : '#FEEFB3';
  }

  public formatGrowthRate(growthRate: number): string {
    return this.growthRateMeaningful(growthRate) ?
      growthRate.toPrecision(3) :
      '0';
  }

  public save(card: HydratedCard, projectId: number): void {
    const design = this.designs.find((d) => d.name.toLowerCase() === card.name.toLowerCase());
    if (!card.designId && design) {
      this.dialog.open(WarningSaveComponent, {
        data: {
          design: card,
          projectId: projectId,
        },
      });
    } else {
      if (card.projectId) {
        this.store.dispatch(new SaveDesign(card, card.projectId));
      } else {
        if (projectId) {
          this.store.dispatch(new SaveDesign(card, projectId));
        } else {
          const dialogRef = this.dialog.open(SelectProjectComponent);
          dialogRef.afterClosed().subscribe(
            (id) => {
              if (id) {
                this.store.dispatch(new SaveDesign(card, id));
              }
            });
        }
      }
    }
  }

  public methodChanged(event: MatSelect): void {
      this.method = event.value;
      this.store.dispatch(new SetMethod(event.value));
  }

  public experimentChanged(event: Experiment): void {
    this.http.get(`${environment.apis.warehouse}/experiments/${event.id}/conditions`).subscribe((conditions: Condition[]) => {
      this.experiment = event;
      this.condition = null;
      this.conditions = conditions;
    });
  }

  public conditionChanged(event: Condition): void {
    this.openDialog();
    this.http.get(`${environment.apis.warehouse}/conditions/${event.id}/data`).subscribe((condition: DataResponse) => {
      this.http.post(`${environment.apis.model}/models/${this.selectedCard.model_id}/modify`, condition).subscribe((operations: Operation[]) => {
        this.condition = event;
        this.store.dispatch(new SetOperations(operations, this.method, this.experiment, this.condition, this.selectedCard.model_id, condition));
      });
    });
  }

  public showHelp(event: Event): void {
    event.stopPropagation();
    this.dialog.open(ShowHelpComponent);
  }

  nameBlur(): void {
    if (this.name.nativeElement.value.length > 0) {
      this.store.dispatch(new RenameCard(this.name.nativeElement.value));
    }
    this.editeName = null;
  }

  // tslint:disable-next-line:no-any
  keyDownFunction(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.name.nativeElement.value.length > 0) {
        this.store.dispatch(new RenameCard(this.name.nativeElement.value));
      }
      this.editeName = null;
    }
  }

  public openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'loader';
    dialogConfig.id = 'loading';
    dialogConfig.data = 'Calculating flux distribution...';
    if (!this.dialog.openDialogs.find((dialog) => dialog.id === 'loading')) {
      this.dialog.open(LoaderComponent, dialogConfig);
    }
  }

  public getModel(id: string, models: types.DeCaF.ModelHeader[]): types.DeCaF.ModelHeader {
    return this.modelService.getModel(id, models);
  }

  public displayFn(item: Experiment): string {
    return item ? item.name : '';
  }

  public displayFnCondition(item: Condition): string {
    return item ? item.name + ((item.protocol && item.protocol.length > 0) ? ', ' + item.protocol : '') : '';
  }

  public filterByQuery(query: string, experiments: Experiment[]): Experiment[] {
    if (query) {
      return experiments.filter((s) => new RegExp(query.toString().toLowerCase()).test(s.name.toLowerCase())).slice(0, 9);
    } else {
      return experiments.slice(0, 9);
    }
  }

  public filterByQueryConditions(query: string): Condition[] {
    if (query && this.conditions) {
      return this.conditions.filter((s) => new RegExp(query.toString().toLowerCase()).test(s.name.toLowerCase())).slice(0, 9);
    } else {
      return this.conditions;
    }
  }

  // tslint:disable-next-line:no-any
  drop(event: CdkDragDrop<string[]>): void {
    console.log('DRRROP');
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }
}
