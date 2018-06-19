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

import {Injectable} from '@angular/core';

@Injectable()
export class RegistryService {
  private registry = {};
  private registeredTargets = {};

  register(name: string, targets: string[], config: object): void {
    if (this.registry.hasOwnProperty(name)) {
      throw new Error(`Registration failed. There is already a configuration object in the registry for '${name}'.`);
    }

    this.registry[name] = config;

    for (const targetName of targets) {
      if (!this.registeredTargets.hasOwnProperty(targetName)) {
        this.registeredTargets[targetName] = [];
      }
      this.registeredTargets[targetName].push(name);
    }
  }

  get(targetName: string): object {
    if (!this.registeredTargets.hasOwnProperty(targetName)) {
      throw new Error(`There is no entry in the registry for '${targetName}'.`);
    }

    return Object.assign({}, ...this.registeredTargets[targetName].map(name => ({[name]: Object.assign({}, this.registry[name])})));
  }
}
