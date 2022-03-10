import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Article, ArticlesFirebaseService, Category, MetaService, QueryConfig } from '@annu/ng-lib';
import { Subscription, filter } from 'rxjs';
import { DEFAULT_PAGE_SIZE } from '../../../config';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  categoryId: string = '';
  category: Category | null = null;
  categoryArticles: Array<Article> = [];

  // Additional Articles and categroies
  allCategories: Array<Category> = [];

  loading: boolean = true;
  error: any;
  errorArticles: any;
  routeStartEvent: Subscription;
  routeEndEvent: Subscription;
  paramsSubscription: Subscription;
  defaultPageSize: number = DEFAULT_PAGE_SIZE;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private articlesFireSvc: ArticlesFirebaseService,
    private metaService: MetaService) {
    // Router Start
    this.routeStartEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
      this.loading = true;
      this.error = null;
    })
    // Router End
    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      this.getCategory();
      this.loadAdditionalPageData();

      if (!this.route.firstChild) {
        this.getCategoryArticles()
      } else {
        this.categoryArticles = [];
      }
    })

    // Params change
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.categoryId = params['categoryId'];
    });
  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.routeStartEvent.unsubscribe();
    this.routeEndEvent.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  public async getCategory() {
    try {
      const queryConfig: QueryConfig = {
        id: this.categoryId,
        isLive: true,
      };
      const cats = await this.articlesFireSvc.getCategories(queryConfig);
      if (cats && cats.length) {
        this.category = cats[0];
      } else {
        this.error = { code: '404', message: `Page does not exist - ${this.categoryId}` }
      }

      this.loading = false;
    } catch (error: any) {
      this.loading = false;
      this.error = error;
    }
  }

  public async getCategoryArticles() {
    this.errorArticles = null;
    try {
      const queryConfig: QueryConfig = {
        isLive: true,
        articleCategoryId: this.categoryId,
        orderField: 'updated',
        pageSize: DEFAULT_PAGE_SIZE,
        startPage: null,
      };

      this.categoryArticles = await this.articlesFireSvc.getArticles(queryConfig);
    } catch (error: any) {
      this.errorArticles = error;
      this.categoryArticles = [];
    }
  }

  private async loadAdditionalPageData() {
    this.allCategories = await this.articlesFireSvc.getCategories({ isLive: true, orderField: 'updated' })
  }
}
