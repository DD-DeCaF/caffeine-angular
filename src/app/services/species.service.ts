import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import * as types from '../app-interactive-map/types';

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
}
