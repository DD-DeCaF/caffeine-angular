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
