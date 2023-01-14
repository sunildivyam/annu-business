import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ARTICLES_ROUTE_RESOLVER_DATA_KEYS, Category, CategoryGroup,  ArticlesHomeViewRouteData, MetaService } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';
import { appConfig } from '../../../config';

const DEFAULT_DESCRIPTION_CHAR_COUNT = 300;

@Component({
  selector: 'app-home',
  templateUrl: './article-views-home.component.html',
  styleUrls: ['./article-views-home.component.scss']
})
export class ArticleViewsHomeComponent implements OnInit, OnDestroy {
  featuredCategories: Array<Category> = [];
  allCategoriesGroups: Array<CategoryGroup> = [];
  descriptionCharCount: number = DEFAULT_DESCRIPTION_CHAR_COUNT;
  error: any;

  // if a category or article does not exist, then these variables will hold the ids of the same and will get thme from queryparams.
  notFoundCategoryId: string = '';
  notFoundArticleId: string = '';

  constructor(public route: ActivatedRoute, private router: Router, private metaService: MetaService,) {
    this.route.data.subscribe(data => this.initFromResolvedData(data));
  }

  ngOnInit(): void {
    this.initFromResolvedData(this.route.snapshot.data);
  }

  ngOnDestroy(): void {}

  private initFromResolvedData(data: any): void {
      const homeViewData = { ...data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW] ?? null } as ArticlesHomeViewRouteData;
      this.allCategoriesGroups = [...homeViewData?.allCategoriesGroups as Array<CategoryGroup> ?? []];
      this.error = homeViewData?.errorAllCategoriesGroups;

      // Extracts featured categories.
      this.featuredCategories = this.allCategoriesGroups
        .filter((cg: CategoryGroup) => cg.category?.isFeatured === true)
        .map((cg: CategoryGroup) => ({ ...cg.category as Category })) || [];

      if (!this.route.firstChild) {
        this.metaService.setPageMeta(appConfig.metaInfo);
      }

      // Sets not found category and/or article ids, in case user is redirected here from respective pages.
      this.notFoundCategoryId = this.route.snapshot.queryParamMap.get('categoryId') || '';
      this.notFoundArticleId = this.route.snapshot.queryParamMap.get('articleId') || '';
  }
}
