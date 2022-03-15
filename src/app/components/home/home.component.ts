import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ARTICLES_ROUTE_RESOLVER_DATA_KEYS, Category, CategoryGroup, HomeViewRouteData } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';

const FEATURED_CATEGORIES_COUNT = 4;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_DESCRIPTION_CHAR_COUNT = 300;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredCategories: Array<Category> = [];
  allCategoriesGroups: Array<CategoryGroup> = [];
  descriptionCharCount: number = DEFAULT_DESCRIPTION_CHAR_COUNT;
  error: any;

  routeEndEvent: Subscription;

  constructor(public route: ActivatedRoute, private router: Router) {
    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - STARTING')
      const homeViewData = { ...this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.HOME_VIEW] } as HomeViewRouteData || {};

      this.allCategoriesGroups = homeViewData?.allCategoriesGroups as Array<CategoryGroup> || [];
      this.error = homeViewData?.errorAllCategoriesGroups;

      // Extracts 1st few categories as featured categories.

      this.featuredCategories = this.allCategoriesGroups.slice(0, FEATURED_CATEGORIES_COUNT).map((cg: CategoryGroup) => cg.category as Category) || [];
      console.log('HOME VIEW - NAVIGATION-END: FILLING DATA TO VIEW - ENDED')
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }
}
