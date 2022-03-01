import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MyCategoriesComponent } from './my-categories/my-categories.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { RouterModule } from '@angular/router';
import { CardModule, CategoryEditorModule, CategoryModule, ArticleModule, ArticleEditorModule, ArticleListModule, ErrorModule, SearchBoxModule, SpinnerModule, TabsModule, ModalModule } from '@annu/ng-lib';
import { MyCategoryComponent } from './my-category/my-category.component';
import { MyArticleComponent } from './my-article';



@NgModule({
  declarations: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent,
    MyCategoryComponent,
    MyArticleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    CardModule,
    SearchBoxModule,
    CategoryModule,
    CategoryEditorModule,
    ArticleModule,
    ArticleEditorModule,
    ArticleListModule,
    ErrorModule,
    SpinnerModule,
    ModalModule,
  ],
  exports: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent,
    MyCategoryComponent,
    MyArticleComponent,
  ],
})
export class DashboardModule { }
