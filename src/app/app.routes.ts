import { Route, Routes } from "@angular/router";

import {
  ArticleViewsHomeComponent,
  ContactUsComponent,
  LoginComponent,
  DashboardComponent,
  MyCategoriesComponent,
  MyArticlesComponent,
  MyCategoryComponent,
  MyArticleComponent,
  ArticleViewComponent,
  CategoryViewComponent,
  UnauthorizedComponent,
  ErrorComponent,
} from "./components";
import { environment } from "../environments/environment";
import {
  IsLoggedInGuard,
  RoleAuthorGuard,
  RoleAdminGuard,
  ArticlesHomeViewRouteResolver,
  CategoryViewRouteResolver,
  ArticleViewRouteResolver,
  ARTICLES_ROUTE_RESOLVER_DATA_KEYS,
  MyCategoriesViewRouteResolver,
  MyArticlesViewRouteResolver,
} from '@annu/ng-lib';

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
        resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.MY_CATEGORIES_VIEW]: MyCategoriesViewRouteResolver },
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
        resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.MY_ARTICLES_VIEW]: MyArticlesViewRouteResolver },
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
    resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW]: ArticlesHomeViewRouteResolver },
    // resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW]: ArticleViewsHomeResolver },
    // Article Public Routes
    children: [
      {
        path: ':categoryId',
        component: CategoryViewComponent,
        data: { title: 'Category view', pageSize: DEFAULT_PAGE_SIZE },
        // resolve: { resolvedCatData: TempResolver },
        resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW]: CategoryViewRouteResolver },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        children: [
          {
            path: ':articleId',
            component: ArticleViewComponent,
            data: { title: 'Article view' },
            resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLE_VIEW]: ArticleViewRouteResolver },
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
