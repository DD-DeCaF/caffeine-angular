import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {AppMaterialModule} from '../app-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RegistryService} from '../registry/registry.service';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [SearchComponent],
  declarations: [SearchComponent],
  providers: [RegistryService]
})
export class SearchModule { }
