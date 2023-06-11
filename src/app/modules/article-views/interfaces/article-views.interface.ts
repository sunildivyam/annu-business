import { Article, PageCategoryGroup } from '@annubiz/ng-lib';

export interface ArticlesHomeViewRouteData {
  pageCategoryGroups?: Array<PageCategoryGroup>;
  primeShowArticles?: Array<Article>;
  footerShowArticles?: Array<Article>;
}

export interface CategoryViewRouteData {
  pageCategoryGroup?: PageCategoryGroup;
  pageCategoryGroups?: Array<PageCategoryGroup>;
}

export interface ArticleViewRouteData {
  article?: Article;
}

export enum PageDirection {
  FORWARD = 'f',
  BACKWARD = 'b',
}
