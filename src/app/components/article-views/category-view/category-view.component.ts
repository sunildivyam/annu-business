import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Category, MetaService, CategoryViewRouteData, ARTICLES_ROUTE_RESOLVER_DATA_KEYS, CategoryGroup } from '@annu/ng-lib';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {
  categoryId: string = '';
  category: Category | null | undefined = null;
  categoryArticles: Array<Article> = [];

  // Additional Articles and categroies
  allCategoriesGroups: Array<CategoryGroup> = [];

  error: any;
  errorAllCategories: any;

  constructor(
    public route: ActivatedRoute,
    private metaService: MetaService) {}

  ngOnInit(): void {
    const categoryViewData = this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW] as CategoryViewRouteData || {};

    this.category = categoryViewData?.categoryGroup?.category as Category || null;
    this.categoryArticles = categoryViewData?.categoryGroup?.articles as Array<Article> || [];

    this.allCategoriesGroups = categoryViewData?.allCategoriesGroups as Array<CategoryGroup> || [];
    this.error = categoryViewData?.errorCategoryGroup;
    this.errorAllCategories = categoryViewData?.errorAllCategoriesGroups;
  }
}
