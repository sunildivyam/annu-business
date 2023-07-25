import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  Article,
  MetaService,
  PageArticles,
  Filter,
  AuthFirebaseService,
  FilterTypes,
  FIREBASE_AUTH_ROLES,
} from '@annubiz/ng-lib';
import { filter, Subscription } from 'rxjs';
import {
  MY_ARTICLES_FILTERS,
  MY_ARTICLES_FILTERS_FOR_ADMIN,
} from '../../constants/my-articles.constants';
import { environment } from '../../../../../environments/environment';
import { DASHBOARD_ROUTE_RESOLVER_DATA_KEYS } from '../../constants/dashboard.constants';
const { appConfig } = environment;
const dashboardMyArticlesMetaInfo =
  environment.dashboardConfig.dashboardMyArticlesMetaInfo;

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss'],
})
export class MyArticlesComponent implements OnInit, OnDestroy {
  articles: Array<Article> = [];
  filteredArticles: Array<Article> = [];
  foundArticles: Array<Article> = [];
  searchKeys: Array<string> = ['id', 'metaInfo.title'];
  articlesFilters: Array<Filter> = [...MY_ARTICLES_FILTERS];

  loading: boolean = true;
  error: any;
  routeStartEvent: Subscription;
  routeEndEvent: Subscription;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    private authService: AuthFirebaseService
  ) {
    this.routeStartEvent = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationStart))
      .subscribe(() => {
        this.loading = true;
        this.error = null;
      });

    this.routeEndEvent = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe(() => {
        this.loading = false;
      });

    this.route.data.subscribe(async (data) => {
      const isAdmin = await this.authService.currentUserHasRole(
        FIREBASE_AUTH_ROLES.ADMIN
      );
      if (isAdmin) {
        this.articlesFilters = [
          ...MY_ARTICLES_FILTERS,
          ...MY_ARTICLES_FILTERS_FOR_ADMIN,
        ];
      }
      const pageArticles: PageArticles =
        data[DASHBOARD_ROUTE_RESOLVER_DATA_KEYS.MY_ARTICLES_VIEW];
      this.articles = pageArticles?.articles || [];
      this.foundArticles = this.articles;
      this.filterArticles(this.articlesFilters, this.foundArticles);
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({
      ...dashboardMyArticlesMetaInfo,
      title: `${appConfig.metaInfo.title} - ${dashboardMyArticlesMetaInfo.title}`,
    });
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }

  public onSearch(foundArticles: Array<Article>): void {
    this.foundArticles = foundArticles;
    this.filterArticles(this.articlesFilters, this.foundArticles);
  }

  public filterArticles(
    filters: Array<Filter>,
    articles: Array<Article>
  ): void {
    this.filteredArticles = articles.filter((art) => {
      let matches = true;
      filters.forEach((filter) => {
        if (filter.enabled) {
          if (filter.type === FilterTypes.SingleSelect) {
            if (filter.id === 'userId') {
              matches =
                filter.filter.value ===
                  (art[filter.id] === this.authService.getCurrentUserId()) &&
                matches === true
                  ? true
                  : false;
            } else {
              matches =
                filter.filter.value === art[filter.id] && matches === true
                  ? true
                  : false;
            }
          } else if (filter.type === FilterTypes.MultiSelect) {
            if (filter.filter.selectedValues?.length) {
              filter.filter.selectedValues.forEach((selectedfeature) => {
                matches =
                  art?.features?.includes(
                    selectedfeature[filter.filter.keyName]
                  ) && matches === true
                    ? true
                    : false;
              });
            }
          }
        }
      });
      return matches;
    });
  }

  public articlesFiltersChanged(filters: Array<Filter>): void {
    this.articlesFilters = filters;
    this.filterArticles(filters, this.foundArticles);
  }
}
