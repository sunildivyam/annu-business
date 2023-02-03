import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ARTICLES_ROUTE_RESOLVER_DATA_KEYS, Category, PageCategoryGroup,  ArticlesHomeViewRouteData, MetaService } from '@annu/ng-lib';

import { environment } from '../../../../../environments/environment';
const { appConfig } = environment;

const DEFAULT_DESCRIPTION_CHAR_COUNT = 300;

@Component({
  selector: 'app-home',
  templateUrl: './article-views-home.component.html',
  styleUrls: ['./article-views-home.component.scss']
})
export class ArticleViewsHomeComponent implements OnInit, OnDestroy {
  featuredCategories: Array<Category> = [];
  pageCategoryGroups: Array<PageCategoryGroup> = [];
  descriptionCharCount: number = DEFAULT_DESCRIPTION_CHAR_COUNT;
  error: any;

  // if a category or article does not exist, then these variables will hold the ids of the same and will get thme from queryparams.
  notFoundCategoryId: string = '';
  notFoundArticleId: string = '';

  constructor(public route: ActivatedRoute, private router: Router, private metaService: MetaService,) {
    this.route.data.subscribe(data => this.initFromResolvedData(data));
    this.route.queryParams.subscribe(params => {
      // Sets not found category and/or article ids, in case user is redirected here from respective pages.
      this.notFoundCategoryId = params['categoryId'] || '';
      this.notFoundArticleId = params['articleId'] || '';
    })
  }

  ngOnInit(): void {
    this.initFromResolvedData(this.route.snapshot.data);
  }

  ngOnDestroy(): void {}

  private initFromResolvedData(data: any): void {
      const homeViewData = { ...data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW] ?? null } as ArticlesHomeViewRouteData;
      this.pageCategoryGroups = [...homeViewData?.pageCategoryGroups ?? []];

      // Extracts featured categories.
      this.featuredCategories = this.pageCategoryGroups
        .filter((cg: PageCategoryGroup) => cg.category?.isFeatured === true)
        .map((cg: PageCategoryGroup) => ({ ...cg.category as Category })) || [];

      if (!this.route.firstChild) {
        this.metaService.setPageMeta(appConfig.metaInfo);
      }
  }
}
