import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article, ArticlesFirebaseService, ARTICLES_ROUTE_RESOLVER_DATA_KEYS, Category, CategoryGroup, HomeViewRouteData, QueryConfig } from '@annu/ng-lib';

const FEATURED_CATEGORIES_COUNT = 4;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_DESCRIPTION_CHAR_COUNT = 300;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredCategories: Array<Category> = [];
  allCategoriesGroups: Array<CategoryGroup> = [];
  descriptionCharCount: number = DEFAULT_DESCRIPTION_CHAR_COUNT;
  error: any;

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    const homeViewData = this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.HOME_VIEW] as HomeViewRouteData || {};

    this.allCategoriesGroups = homeViewData?.allCategoriesGroups as Array<CategoryGroup> || [];
    this.error = homeViewData?.errorAllCategoriesGroups;

    // Extracts 1st few categories as featured categories.

    this.featuredCategories = this.allCategoriesGroups.slice(0, FEATURED_CATEGORIES_COUNT).map((cg: CategoryGroup) => cg.category as Category) || [];
  }

}
