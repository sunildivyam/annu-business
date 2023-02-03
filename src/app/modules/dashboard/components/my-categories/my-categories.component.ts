import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Category, MetaService, PageCategories, Filter, FilterTypes, AuthFirebaseService, FIREBASE_AUTH_ROLES } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';
import { MY_CATEGORIES_FILTERS, MY_CATEGORIES_FILTERS_FOR_ADMIN } from '../../constants/my-categories.constants';
import { environment } from '../../../../../environments/environment';
import { DASHBOARD_ROUTE_RESOLVER_DATA_KEYS } from '../../constants/dashboard.constants';
const { appConfig } = environment;
const dashboardMyCategoriesMetaInfo = environment.dashboardConfig.dashboardMyCategoriesMetaInfo;

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit, OnDestroy {
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  foundCategories: Array<Category> = [];
  searchKeys: Array<string> = ['id', 'metaInfo.title'];
  categoriesFilters: Array<Filter> = [...MY_CATEGORIES_FILTERS];

  loading: boolean = true;
  error: any;
  routeStartEvent: Subscription;
  routeEndEvent: Subscription;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    private authService: AuthFirebaseService) {

    this.routeStartEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
      this.loading = true;
      this.error = null;
    })

    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      this.loading = false;
    })

    this.route.data.subscribe(async data => {
      const isAdmin = await this.authService.currentUserHasRole(FIREBASE_AUTH_ROLES.ADMIN);
      if (isAdmin) {
        this.categoriesFilters = [...MY_CATEGORIES_FILTERS_FOR_ADMIN, ...MY_CATEGORIES_FILTERS];
      }
      const pageCategories: PageCategories = data[DASHBOARD_ROUTE_RESOLVER_DATA_KEYS.MY_CATEGORIES_VIEW];
      this.categories = pageCategories?.categories || [];
      this.foundCategories = this.categories;
      this.filterCategories(this.categoriesFilters, this.foundCategories);
      this.loading = false;
    })
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({ ...dashboardMyCategoriesMetaInfo, title: `${appConfig.metaInfo.title} - ${dashboardMyCategoriesMetaInfo.title}` });
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }

  public onSearch(foundCategories: Array<Category>): void {
    this.foundCategories = foundCategories;
    this.filterCategories(this.categoriesFilters, this.foundCategories);
  }

  public filterCategories(filters: Array<Filter>, categories: Array<Category>): void {
    this.filteredCategories = categories.filter(cat => {
      let matches = true;
      filters.forEach(filter => {
        if (filter.enabled) {
          if (filter.type === FilterTypes.SingleSelect) {
            if (filter.id === 'userId') {
              matches = filter.filter.value === (cat[filter.id] === this.authService.getCurrentUserId()) && matches === true ? true : false;
            } else {
              matches = filter.filter.value === cat[filter.id] && matches === true ? true : false;
            }
          } else if (filter.type === FilterTypes.MultiSelect) {
            if (filter.filter.selectedValues?.length) {
              filter.filter.selectedValues.forEach(selectedfeature => {
                matches = cat?.features?.includes(selectedfeature[filter.filter.keyName]) && matches === true ? true : false;
              });
            }
          }
        }
      })
      return matches;
    })
  }

  public categoriesFiltersChanged(filters: Array<Filter>): void {
    this.categoriesFilters = filters;
    this.filterCategories(filters, this.foundCategories);
  }
}
