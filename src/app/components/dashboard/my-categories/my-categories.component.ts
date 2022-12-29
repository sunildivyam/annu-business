import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ArticlesFirebaseService, AuthFirebaseService, Category, QueryConfig, MetaService } from '@annu/ng-lib';
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
    private articlesFireSvc: ArticlesFirebaseService,
    private authFireSvc: AuthFirebaseService,
    private metaService: MetaService) {

    this.routeStartEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
      this.loading = true;
      this.error = null;
    })

    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      if (!this.route.firstChild) {
        this.getCategories();
      } else {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({ ...dashboardMyCategoriesMetaInfo, title: `${appConfig.metaInfo.title} - ${dashboardMyCategoriesMetaInfo.title}` });
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }

  public async getCategories() {
    try {
      const queryConfig: QueryConfig = {
        userId: this.authFireSvc.getCurrentUserId()
      };
      this.categories = await this.articlesFireSvc.getCategories(queryConfig);
      this.filteredCategories = this.categories;
      this.loading = false;
    } catch (error: any) {
      this.loading = false;
      this.error = error;
    }
  }

  public onSearch(foundCategories: Array<Category>): void {
    this.filteredCategories = foundCategories;
  }
}
