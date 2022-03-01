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
import { appConfig } from "./config";
import { IsLoggedInGuard } from '@annu/ng-lib';


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
    path: ':categoryId', component: CategoryViewComponent , data: { title: 'Category view' },
    children: [
      {
        path: ':articleId', component: ArticleViewComponent, data: { title: 'Category view' }
      },
    ]
  }
]


export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: appConfig.title } },

  // Main Routes
  ...mainRoutes,

  // Auth Routes
  ...authRoutes,

  // tNc Routes
  ...tNcRoutes,

  // Author Routes
  ...authorRoutes,

  // Article Public Routes
  ...articlesPublicRoutes,

  //Any Other route (non-existant routes)
  { path: '**', redirectTo: '', pathMatch: 'full' },  // or set to ErrorComponentPage
];
