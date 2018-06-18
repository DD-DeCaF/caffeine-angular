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

import {Component} from '@angular/core';
import {RegistryService} from '../registry/registry.service';
import {Router} from '@angular/router';


interface Source {
  resourceName: string;
  pluralName: string;
  query(searchText: string): Promise<any>;
  getQueryParams(item: any): { [key: string]: any };
  getRouterLink(item: any): Array<string|number> | string | number;
  formatAsText(item: any): string;
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  showSearch = false;
  searchText = '';
  placeholder = 'Search';
  searchSources: Array<Source>;

  constructor(registry: RegistryService, private router: Router) {
    this.searchSources = Object.values(registry.get('search'));
    this.placeholder = `Search ${this.searchSources.map(source => source.pluralName).join(', ')}`;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchText = '';
  }

  query() {
    if (this.searchText && this.searchText.length > 1) {
      const searches = [];
      for (const source of this.searchSources) {
        searches.push(source.query(this.searchText)
          .then(items =>
            items.map(item => ({
              source,
              routerLink: source.getRouterLink(item),
              queryParams: source.getQueryParams(item),
              text: source.formatAsText(item)
            }))
          )
          .catch(() => [])
        );
      }

      return Promise.all(searches)
        .then(results => results
          .reduce((a, b) => a.concat(b))
          .sort((a, b) => a.text.localeCompare(b.text))
        );
    }
  }

  onItemSelection(item: any) {
    if (item) {
      this.searchText = '';
      this.showSearch = false;
      this.router.navigate(item.routerLink, {queryParams: item.queryParams});
    }
  }
}
