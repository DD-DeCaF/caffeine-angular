// import {Item, Route} from 'potion-client';
import { Item, Route } from '../potion';

export class User extends Item {
  static current = Route.GET('/me');
  static readSettings = Route.GET('/settings');
  static updateSettings = Route.POST('/settings');
  static roles = Route.GET('/roles');
  static changePassword = Route.POST('/change-password');

  displayName: string;
  title: string;

  shortFullName() {
    return `${(this.firstName || '').split(' ')[0]} ${this.lastName}`;
  }
}
