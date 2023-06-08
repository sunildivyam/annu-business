import { StateKey } from '@angular/core';
import { Article, Category, PageCategoryGroup } from '@annubiz/ng-lib';

/*
  Stores Application state
*/
export interface AppState {
  allLiveCategories?: Array<Category> | AppStateValue;
  mainNavCategories?: Array<Category> | AppStateValue;
  footerNavCategories?: Array<Category> | AppStateValue;
  featuredCategories?: Array<Category> | AppStateValue;
  homeViewCategoryGroups?: Array<PageCategoryGroup> | AppStateValue;
  categoryViewCategoryGroup?: PageCategoryGroup | AppStateValue;
  articleViewArticle?: Article | AppStateValue;
}

/**
 * SSR Transfer State keys
 */
export interface StateKeys {
  [index: string]: StateKey<AppStateValue>;
}

// This allows to
export type AppStateValue =
  | Array<PageCategoryGroup>
  | Array<Category>
  | PageCategoryGroup
  | Article;
