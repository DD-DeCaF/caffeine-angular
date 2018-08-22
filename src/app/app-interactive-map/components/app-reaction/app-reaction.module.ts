import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../../../app-material.module';

import { AppReactionComponent } from './app-reaction.component';
import { AppBoundsComponent } from './components/app-bounds/app-bounds.component';
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { AppObjectiveComponent } from './components/app-objective/app-objective.component';
import { AppPanelComponent } from './components/app-panel/app-panel.component';

@NgModule({
  declarations: [
    AppReactionComponent,
    AppBoundsComponent,
    AppDetailComponent,
    AppObjectiveComponent,
    AppPanelComponent,
  ],
  imports: [
    AppMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AppReactionComponent,
  ],
})
export class ReactionModule {}
