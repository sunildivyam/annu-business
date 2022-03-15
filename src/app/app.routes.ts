import { Routes } from "@angular/router";
import {
  HomeComponent,
  ContactUsComponent,
  LoginComponent,
  MyProfileComponent,
  TncComponent,
  PrivacyPolicyComponent,
  DashboardComponent,
  MyCategoriesComponent,
  MyArticlesComponent,
  MyCategoryComponent,
  MyArticleComponent,
  ArticleViewComponent,
  CategoryViewComponent,
} from "./components";
import { appConfig, DEFAULT_PAGE_SIZE } from "./config";
import {
  IsLoggedInGuard,
  HomeViewRouteResolver,
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

// tNc Routes
export const tNcRoutes = [
  { path: 'tnc', component: TncComponent, data: { title: 'Terms and Conditions' } },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { title: 'Privacy Policy' } },
]

// Author Dashboard Routes
export const authorRoutes = [
  {
    path: 'dashboard', component: DashboardComponent, data: { title: 'My Dashboard' },
    canActivate: [IsLoggedInGuard],
    canActivateChild: [IsLoggedInGuard],
    children: [
      {
        path: 'my-categories', component: MyCategoriesComponent, data: { title: 'My Categories' },
        children: [
          { path: ':id', component: MyCategoryComponent, data: { title: 'My Category' } },
        ]
      },
      {
        path: 'my-articles', component: MyArticlesComponent, data: { title: 'My Articles' },
        children: [
          { path: ':id', component: MyArticleComponent, data: { title: 'My Article' } },
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

  // tNc Routes
  ...tNcRoutes,

  // Author Routes
  ...authorRoutes,

  // Home and children routes
  {
    path: '', component: HomeComponent, data: { title: appConfig.metaInfo.title, pageSize: DEFAULT_PAGE_SIZE },
    resolve: { [ARTICLES_ROUTE_RESOLVER_DATA_KEYS.HOME_VIEW]: HomeViewRouteResolver},
    // Article Public Routes
    children: [...articlesPublicRoutes],
  },

  //Any Other route (non-existant routes)
  { path: '**', redirectTo: '', pathMatch: 'full' },  // or set to ErrorComponentPage
];
