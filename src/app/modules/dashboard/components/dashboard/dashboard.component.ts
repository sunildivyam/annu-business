import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Article,
  ArticlesFirebaseHttpService,
  AuthFirebaseService,
  CategoryFeatures,
  FIREBASE_AUTH_ROLES,
  MetaService,
  PageCategoryGroup,
} from '@annubiz/ng-lib';
import { filter, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';

const { appConfig } = environment;
const dashboardMetaInfo = environment.dashboardConfig.dashboardMetaInfo;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isAuthor: boolean = false;
  isAdmin: boolean = false;
  routeEndEvent: Subscription;
  helpArticles: Array<Article> = [];

  constructor(
    public authFireSvc: AuthFirebaseService,
    private articlesHttp: ArticlesFirebaseHttpService,
    private metaService: MetaService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.routeEndEvent = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.route.firstChild) {
          this.metaService.setPageMeta({
            ...dashboardMetaInfo,
            title: `${appConfig.metaInfo.title} - ${dashboardMetaInfo.title}`,
          });
        }
      });
  }

  ngOnInit(): void {
    this.isAuthorFn();
    this.isAdminFn();
    this.getHelpDocs();
    this.metaService.setPageMeta({
      ...dashboardMetaInfo,
      title: `${appConfig.metaInfo.title} - ${dashboardMetaInfo.title}`,
    });
  }

  public async isAuthorFn(): Promise<boolean> {
    this.isAuthor = await this.authFireSvc.currentUserHasRole(
      FIREBASE_AUTH_ROLES.AUTHOR
    );

    return this.isAuthor;
  }

  public async isAdminFn(): Promise<boolean> {
    this.isAdmin = await this.authFireSvc.currentUserHasRole(
      FIREBASE_AUTH_ROLES.ADMIN
    );

    return this.isAdmin;
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }

  public onOutletActivated(): void {}

  public async getHelpDocs() {
    if (this.route.firstChild) return;
    const pageCategoryGroups: Array<PageCategoryGroup> =
      await this.articlesHttp.getLiveShallowArticlesOfCategories([
        CategoryFeatures.helpDocs,
      ]);
    const pageCategoryGroup: PageCategoryGroup =
      (pageCategoryGroups && pageCategoryGroups[0]) || null;
    this.helpArticles = pageCategoryGroup?.pageArticles?.articles || [];
  }
}
