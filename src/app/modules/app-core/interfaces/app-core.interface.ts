import { StateKey } from '@angular/core';
import { Category, PageCategoryGroup } from '@annubiz/ng-lib';

export interface AppState {
  navCategories?: Array<Category>;
}

export interface StateKeys {
  [key: string]: StateKey<Array<Category>>;
}
