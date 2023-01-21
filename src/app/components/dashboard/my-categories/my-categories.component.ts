import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Category, MetaService, ARTICLES_ROUTE_RESOLVER_DATA_KEYS, PageCategories } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';
import { appConfig, dashboardMyCategoriesMetaInfo } from '../../../config';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit, OnDestroy {
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  searchKeys: Array<string> = ['id', 'metaInfo.title'];

  loading: boolean = true;
  error: any;
  routeStartEvent: Subscription;
  routeEndEvent: Subscription;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService) {

    this.routeStartEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
      this.loading = true;
      this.error = null;
    })

    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      this.loading = false;
    })

    this.route.data.subscribe(data => {
      const pageCategories: PageCategories = data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.MY_CATEGORIES_VIEW];
      this.categories = pageCategories?.categories || [];
      this.filteredCategories = this.categories;
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
    this.filteredCategories = foundCategories;
  }
}
