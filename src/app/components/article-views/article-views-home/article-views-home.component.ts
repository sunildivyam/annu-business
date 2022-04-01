import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ARTICLES_ROUTE_RESOLVER_DATA_KEYS, Category, CategoryGroup, ArticlesHomeViewRouteData, MetaService } from '@annu/ng-lib';
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

  routeEndEvent: Subscription;

  constructor(public route: ActivatedRoute, private router: Router, private metaService: MetaService,) {
    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - STARTING')
      const homeViewData = { ...this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW] } as ArticlesHomeViewRouteData || {};
      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - ENDED 1')
      this.allCategoriesGroups = homeViewData?.allCategoriesGroups as Array<CategoryGroup> || [];
      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - ENDED 2')
      this.error = homeViewData?.errorAllCategoriesGroups;
      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - ENDED 3')
      // Extracts 1st few categories as featured categories.

      this.featuredCategories = this.allCategoriesGroups
        .filter((cg: CategoryGroup) => cg.category?.isFeatured === true)
        .map((cg: CategoryGroup) => cg.category as Category) || [];

      if (!this.route.firstChild) {
        this.metaService.setPageMeta(appConfig.metaInfo);
      }

      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - ENDED')
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }
}
