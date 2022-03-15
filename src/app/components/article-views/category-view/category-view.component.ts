import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Article, Category, MetaService, CategoryViewRouteData, ARTICLES_ROUTE_RESOLVER_DATA_KEYS, CategoryGroup, MetaInfo } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';
import { appConfig } from '../../../config';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  categoryId: string = '';
  category: Category | null | undefined = null;
  categoryArticles: Array<Article> = [];

  // Additional Articles and categroies
  allCategoriesGroups: Array<CategoryGroup> = [];

  error: any;
  errorAllCategories: any;
  routeEndEvent: Subscription;

  constructor(
    public route: ActivatedRoute,
    private metaService: MetaService,
    private router: Router) {
    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      console.log('CATEGORY VIEW - NAVIGATION-END: FILLING DATA TO VIEW - STARTING')
      const categoryViewData = { ...this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW] } as CategoryViewRouteData || {};

      this.category = categoryViewData?.categoryGroup?.category as Category || null;
      this.categoryArticles = categoryViewData?.categoryGroup?.articles as Array<Article> || [];

      this.allCategoriesGroups = categoryViewData?.allCategoriesGroups as Array<CategoryGroup> || [];
      this.error = categoryViewData?.errorCategoryGroup;
      this.errorAllCategories = categoryViewData?.errorAllCategoriesGroups;

      this.metaService.setPageMeta({ ...this.category?.metaInfo as MetaInfo, title: `${appConfig.metaInfo.title} - ${this.category?.metaInfo?.title}` });

      console.log('CATEGORY VIEW - NAVIGATION-END: FILLING DATA TO VIEW - ENDED')
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }
}
