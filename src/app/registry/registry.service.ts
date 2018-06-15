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
