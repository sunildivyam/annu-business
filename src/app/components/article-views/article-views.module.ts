import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleViewsComponent } from './article-views.component';
import { CategoryViewComponent } from './category-view/category-view.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { RouterModule } from '@angular/router';
import { ArticleModule, ArticleViewModule, CategoryModule, ErrorModule, SpinnerModule } from '@annu/ng-lib';



@NgModule({
  declarations: [
    ArticleViewsComponent,
    CategoryViewComponent,
    ArticleViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CategoryModule,
    ArticleModule,
    ErrorModule,
    SpinnerModule,
    ArticleViewModule
  ],
  exports: [
    ArticleViewsComponent,
    CategoryViewComponent,
    ArticleViewComponent,
  ],
})
export class ArticleViewsModule { }
