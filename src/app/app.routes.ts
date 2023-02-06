import { Route, Routes } from "@angular/router";
import { LoginComponent, ContactUsComponent } from "./modules/app-core";
import { DashboardComponent, MyCategoriesComponent, MyArticlesComponent, MyArticleComponent, MyCategoryComponent } from "./modules/dashboard";
import { ArticleViewsHomeComponent, CategoryViewComponent, ArticleViewComponent } from "./modules/article-views";
import { ErrorComponent, UnauthorizedComponent } from "./modules/error-pages";
import { environment } from "../environments/environment";
import {
  IsLoggedInGuard,
  RoleAuthorGuard,
  RoleAdminGuard,
} from '@annu/ng-lib';
import {
  ArticlesHomeViewRouteResolver,
  CategoryViewRouteResolver,
  ArticleViewRouteResolver,
  ARTICLE_VIEWS_ROUTE_RESOLVER_DATA_KEYS,
} from './modules/article-views';
import {
  DASHBOARD_ROUTE_RESOLVER_DATA_KEYS,
  MyCategoriesViewRouteResolver,
  MyArticlesViewRouteResolver,
} from './modules/dashboard';
const { appConfig } = environment;
const DEFAULT_PAGE_SIZE = appConfig.defaultPageSize;

export const routes: Routes = [
  {
    path: 'contact-us',
    component: ContactUsComponent,
    data: { title: 'Contact Us' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Sign In' }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: { title: 'Unauthorized' }
  },
  {
    path: 'error',
    component: ErrorComponent,
    data: { title: 'Error' }
  },
  {
    path: 'error/:errorid',
    component: ErrorComponent,
    data: { title: 'Error' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'My Dashboard'
    },
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'my-categories',
        component: MyCategoriesComponent,
        data: {
          title: 'My Categories',
          redirectUrl: '/unauthorized'
        },
        resolve: { [DASHBOARD_ROUTE_RESOLVER_DATA_KEYS.MY_CATEGORIES_VIEW]: MyCategoriesViewRouteResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [RoleAdminGuard],
        canActivateChild: [RoleAdminGuard],
        children: [
          {
            path: ':id',
            component: MyCategoryComponent,
            data: {
              title: 'My Category',
              redirectUrl: '/unauthorized'
            }
          },
        ]
      },
      {
        path: 'my-articles',
        component: MyArticlesComponent,
        data: {
          title: 'My Articles',
          redirectUrl: '/unauthorized'
        },
        resolve: { [DASHBOARD_ROUTE_RESOLVER_DATA_KEYS.MY_ARTICLES_VIEW]: MyArticlesViewRouteResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [RoleAuthorGuard],
        canActivateChild: [RoleAuthorGuard],
        children: [
          {
            path: ':id',
            component: MyArticleComponent,
            data: {
              title: 'My Article',
              redirectUrl: '/unauthorized'
            }
          },
        ]
      },
    ]
  },
  {
    path: '',
    component: ArticleViewsHomeComponent,
    data: { title: appConfig.metaInfo.title, pageSize: DEFAULT_PAGE_SIZE },
    // resolve: { resolvedData: TempResolver },
    resolve: { [ARTICLE_VIEWS_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW]: ArticlesHomeViewRouteResolver },
    // Article Public Routes
    children: [
      {
        path: ':categoryId',
        component: CategoryViewComponent,
        data: { title: 'Category view', pageSize: DEFAULT_PAGE_SIZE },
        // resolve: { resolvedCatData: TempResolver },
        resolve: { [ARTICLE_VIEWS_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW]: CategoryViewRouteResolver },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        children: [
          {
            path: ':articleId',
            component: ArticleViewComponent,
            data: { title: 'Article view' },
            resolve: { [ARTICLE_VIEWS_ROUTE_RESOLVER_DATA_KEYS.ARTICLE_VIEW]: ArticleViewRouteResolver },
            runGuardsAndResolvers: 'paramsOrQueryParamsChange',
          },
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
