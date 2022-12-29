import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Article, Category, MetaService, CategoryViewRouteData, ARTICLES_ROUTE_RESOLVER_DATA_KEYS, CategoryGroup, MetaInfo, UtilsService } from '@annu/ng-lib';
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
  // This will have orderBy(updated) field value of last article record from the list.
  startPage: string = '';
  endPage: string = '';

  error: any;
  errorAllCategories: any;
  routeEndEvent: Subscription;

  constructor(
    public route: ActivatedRoute,
    private metaService: MetaService,
    private router: Router,
    private utilsSvc: UtilsService) {
    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      const categoryViewData: CategoryViewRouteData = { ...this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW] } as CategoryViewRouteData || {};

      this.category = { ...categoryViewData?.categoryGroup?.category as Category ?? null };

      /*
      * if category not found and if it has no child routes, then redirect to home page.
      * That means when an article route exist and category route does not, then it does not redirect to home,
      * but shows the article route.
      */
      if (!this.route.firstChild && (!this.category || !this.category.id)) {
        const paramCategoryId = this.route.snapshot.paramMap.get('categoryId');
        this.router.navigateByUrl(`?categoryId=${paramCategoryId}`, { skipLocationChange: true });
      }

      this.categoryArticles = [...categoryViewData?.categoryGroup?.articles ?? [] as Array<Article>];
      this.startPage = this.utilsSvc.dateStringToTotalTimeString(categoryViewData.startPage || '');
      this.endPage = this.utilsSvc.dateStringToTotalTimeString(categoryViewData.endPage || '');
      this.allCategoriesGroups = [...categoryViewData?.allCategoriesGroups ?? [] as Array<CategoryGroup>];
      this.error = categoryViewData?.errorCategoryGroup;
      this.errorAllCategories = categoryViewData?.errorAllCategoriesGroups;

      if (!this.route.firstChild) {
        this.metaService.setPageMeta({ ...this.category?.metaInfo as MetaInfo, title: `${appConfig.metaInfo.title} - ${this.category?.metaInfo?.title}` });
      }
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }
}
