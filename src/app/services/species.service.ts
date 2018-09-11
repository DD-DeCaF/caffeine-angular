import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import * as types from '../app-interactive-map/types';
import * as typesDesign from '../app-design-tool/types';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {

  constructor(
    private http: HttpClient,
  ) {}

  loadSpecies(): Observable<types.Species[]> {
    return this.http.get<types.Species[]>(`${environment.apis.warehouse}/organisms`);
  }

  loadProducts(): Observable<typesDesign.Product[]> {
    return this.http.get<typesDesign.Product[]>(`urlproducts`);
  }

  loadJobs(): Observable<string[]> {
    return this.http.get<string[]>(`urljobs`);
  }

  abortJob(id: string): Observable<string> {
    return this.http.post<string>(`urljobs`, id);
  }
}
