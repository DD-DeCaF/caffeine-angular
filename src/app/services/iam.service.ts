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

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import {Project, NewProjectResponse} from '../projects/types';

@Injectable()
export class IamService {

  constructor(
    private http: HttpClient,
  ) {}

  createProject(project: Project): Observable<NewProjectResponse> {
    return this.http.post<NewProjectResponse>(`${environment.apis.iam}/projects`, project);
  }

  getProjects(refresh: boolean = false): Observable<Project[]> {
    const params = new HttpParams().set('refresh', refresh.toString());
    return this.http.get<Project[]>(`${environment.apis.iam}/projects`, {params: params});
  }
}
