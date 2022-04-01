import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryViewComponent } from './category-view/category-view.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { RouterModule } from '@angular/router';
import { ArticleModule, ArticlesRouteResolversModule, ArticleViewModule, CardModule, CategoryArticlesListModule, CategoryModule, ErrorModule, SpinnerModule } from '@annu/ng-lib';
import { ArticleViewsHomeComponent } from './article-views-home';



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
    ArticlesRouteResolversModule,
  ],
  exports: [
    ArticleViewsHomeComponent,
    CategoryViewComponent,
    ArticleViewComponent,
  ],
})
export class ArticleViewsModule { }
