import { Routes } from "@angular/router";
import {
  ArticleViewsHomeComponent,
  ContactUsComponent,
  LoginComponent,
  TncComponent,
  PrivacyPolicyComponent,
  DashboardComponent,
  MyCategoriesComponent,
  MyArticlesComponent,
  MyCategoryComponent,
  MyArticleComponent,
  ArticleViewComponent,
  CategoryViewComponent,
  UnauthorizedComponent,
} from "./components";
import { appConfig, DEFAULT_PAGE_SIZE } from "./config";
import {
  IsLoggedInGuard,
  RoleAuthorGuard,
  RoleAdminGuard,
  ArticlesHomeViewRouteResolver,
  CategoryViewRouteResolver,
  ArticleViewRouteResolver,
  ARTICLES_ROUTE_RESOLVER_DATA_KEYS,
} from '@annu/ng-lib';


// Main Nav Routes
export const mainRoutes = [
  { path: 'contact-us', component: ContactUsComponent, data: { title: 'Contact Us' } },

]

// Auth Routes
export const authRoutes = [
  { path: 'login', component: LoginComponent, data: { title: 'Sign In' } },
]

// error Routes
export const errorRoutes = [
  { path: 'unauthorized', component: UnauthorizedComponent, data: { title: 'Unauthorized' } },
]


// Author Dashboard Routes
export const authorRoutes = [
  {
    path: 'dashboard', component: DashboardComponent, data: { title: 'My Dashboard' },
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    children: [
      {
        path: 'my-categories', component: MyCategoriesComponent, data: { title: 'My Categories', redirectUrl: '/unauthorized' },
        canActivate: [RoleAdminGuard],
        canActivateChild: [RoleAdminGuard],
        children: [
          { path: ':id', component: MyCategoryComponent, data: { title: 'My Category', redirectUrl: '/unauthorized' } },
        ]
      },
      {
        path: 'my-articles', component: MyArticlesComponent, data: { title: 'My Articles', redirectUrl: '/unauthorized' },
        canActivate: [RoleAuthorGuard],
        canActivateChild: [RoleAuthorGuard],
        children: [
          { path: ':id', component: MyArticleComponent, data: { title: 'My Article', redirectUrl: '/unauthorized' } },
        ]
      },
    ]
  },
]

// Articles Public Routes
export const articlesPublicRoutes = [
  {
    path: ':categoryId', component: CategoryViewComponent,
    data: { title: 'Category view', pageSize: DEFAULT_PAGE_SIZE },
    resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.CATEGORY_VIEW]: CategoryViewRouteResolver },
    children: [
      {
        path: ':articleId', component: ArticleViewComponent,
        data: { title: 'Article view' },
        resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLE_VIEW]: ArticleViewRouteResolver },
      },
    ]
  }
]


export const routes: Routes = [

  // Main Routes
  ...mainRoutes,

  // Auth Routes
  ...authRoutes,

  // Error Routes
  ...errorRoutes,

  // Author Routes
  ...authorRoutes,

  // Home and children routes
  {
    path: '', component: ArticleViewsHomeComponent, data: { title: appConfig.metaInfo.title, pageSize: DEFAULT_PAGE_SIZE },
    resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW]: ArticlesHomeViewRouteResolver },
    // Article Public Routes
    children: [...articlesPublicRoutes],
  },

  //Any Other route (non-existant routes)
  { path: '**', redirectTo: '', pathMatch: 'full' },  // or set to ErrorComponentPage
];
