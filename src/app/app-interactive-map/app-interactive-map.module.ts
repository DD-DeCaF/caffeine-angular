import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from '../app-material.module';

import { AppInteractiveMapComponent } from './app-interactive-map.component';
import { ReactionModule } from './components/app-reaction/app-reaction.module';
import { AppBuildComponent } from './components/app-build/app-build.component';
import { AppCardInfoComponent } from './components/app-card-info/app-card-info.component';
import { AppLegendComponent } from './components/app-legend/app-legend.component';


@NgModule({
  declarations: [
    AppInteractiveMapComponent,
    AppBuildComponent,
    AppCardInfoComponent,
    AppLegendComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    AppMaterialModule,

    ReactionModule,
  ],
  exports: [
    AppInteractiveMapComponent,
  ],
})
export class AppInteractiveMapModule {}
