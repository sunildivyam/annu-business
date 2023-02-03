import { Article, PageCategoryGroup } from "@annubiz/ng-lib";

export interface ArticlesHomeViewRouteData {
    pageCategoryGroups?: Array<PageCategoryGroup>;
}

export interface CategoryViewRouteData {
    pageCategoryGroup?: PageCategoryGroup;
    pageCategoryGroups?: Array<PageCategoryGroup>;
}

export interface ArticleViewRouteData {
    article?: Article
}

export enum PageDirection {
    FORWARD = 'f',
    BACKWARD = 'b'
};
