import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BiggSearchService {

  constructor(private http: HttpClient) {}

  search(query: string): Observable<Object> {
    const apiURL = `${environment.apis.bigg}/search?query=${query}&search_type=reactions`;
    return this.http.get(apiURL);
  }
}
