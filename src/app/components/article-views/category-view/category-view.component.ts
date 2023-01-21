import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Article, Category, MetaService, CategoryViewRouteData, ARTICLES_ROUTE_RESOLVER_DATA_KEYS, PageCategoryGroup, MetaInfo, UtilsService } from '@annu/ng-lib';
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
  pageCategoryGroups: Array<PageCategoryGroup> = [];
  // This will have orderBy(updated) field value of last article record from the list.
  // startPage: string = '';
  endPage: string = '';

  error: any;
  errorAllCategories: any;

  constructor(
    public route: ActivatedRoute,
    private metaService: MetaService,
    private router: Router,
    private utilsSvc: UtilsService) {
    this.route.data.subscribe((data) => this.initFromResolvedData(data))
  }

  ngOnInit(): void {
    this.initFromResolvedData(this.route.snapshot.data);
  }

  ngOnDestroy(): void {
  }

  private initFromResolvedData(data: any): void {
    const categoryViewData: CategoryViewRouteData = { ...data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW] ?? null } as CategoryViewRouteData;
    const pageCategoryGroup = { ...categoryViewData?.pageCategoryGroup ?? {} };
    this.category = { ...pageCategoryGroup?.category as Category ?? null };

    /*
    * if category not found and if it has no child routes, then redirect to home page.
    * That means when an article route exist and category route does not, then it does not redirect to home,
    * but shows the article route.
    */
    if (!this.route.firstChild && (!this.category || !this.category.id)) {
      const paramCategoryId = this.route.snapshot.paramMap.get('categoryId');
      this.router.navigateByUrl(`?categoryId=${paramCategoryId}`, { skipLocationChange: false });
      return;
    }

    this.categoryArticles = [...pageCategoryGroup?.pageArticles?.articles ?? [] as Array<Article>];
    // this.startPage = this.utilsSvc.dateStringToTotalTimeString(pageCategoryGroup?.pageArticles?.previousPage?.updated || '');
    this.endPage = this.utilsSvc.dateStringToTotalTimeString(pageCategoryGroup?.pageArticles?.endPage || '');
    this.pageCategoryGroups = [...categoryViewData?.pageCategoryGroups ?? [] as Array<PageCategoryGroup>];

    if (!this.route.firstChild) {
      this.metaService.setPageMeta({ ...this.category?.metaInfo as MetaInfo, title: `${appConfig.metaInfo.title} - ${this.category?.metaInfo?.title}` });
    }
  }
}
