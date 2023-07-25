import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryViewComponent } from './components/category-view/category-view.component';
import { ArticleViewComponent } from './components/article-view/article-view.component';
import { RouterModule } from '@angular/router';
import {
  ArticleModule,
  ArticleViewModule,
  CardModule,
  CategoryArticlesListModule,
  CategoryModule,
  ErrorModule,
  SpinnerModule,
  ArticlesSlideshowModule,
} from '@annubiz/ng-lib';
import { ArticleViewsHomeComponent } from './components/article-views-home/article-views-home.component';
import { ArticlesHomeViewRouteResolver } from './services/articles-home-view-route-resolver/articles-home-view-route.resolver';
import { CategoryViewRouteResolver } from './services/category-view-route-resolver/category-view-route.resolver';
import { ArticleViewRouteResolver } from './services/article-view-route-resolver/article-view-route.resolver';

@NgModule({
  declarations: [
    ArticleViewsHomeComponent,
    CategoryViewComponent,
    ArticleViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    CategoryModule,
    ArticleModule,
    ErrorModule,
    SpinnerModule,
    ArticleViewModule,
    CategoryArticlesListModule,
    ArticlesSlideshowModule,
  ],
  exports: [
    ArticleViewsHomeComponent,
    CategoryViewComponent,
    ArticleViewComponent,
  ],
  providers: [
    ArticlesHomeViewRouteResolver,
    CategoryViewRouteResolver,
    ArticleViewRouteResolver,
  ],
})
export class ArticleViewsModule {}
