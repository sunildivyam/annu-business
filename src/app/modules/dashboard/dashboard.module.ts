import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyCategoriesComponent } from './components/my-categories/my-categories.component';
import { MyArticlesComponent } from './components/my-articles/my-articles.component';
import { RouterModule } from '@angular/router';
import { CardModule, CategoryEditorModule, CategoryModule, ArticleModule, ArticleEditorModule, ArticleListModule, ErrorModule, SearchBoxModule, SpinnerModule, TabsModule, ModalModule, ToggleModule, MultiSelectBoxModule, CollapsibleModule, FiltersModule, OpenaiFormModule } from '@annu/ng-lib';
import { MyCategoryComponent } from './components/my-category/my-category.component';
import { MyArticleComponent } from './components/my-article/my-article.component';
import { FormsModule } from '@angular/forms';
import { MyArticlesViewRouteResolver } from './services/my-articles-view-route-resolver/my-articles-view-route.resolver';
import { MyCategoriesViewRouteResolver } from './services/my-categories-view-route-resolver/my-categories-view-route.resolver';



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
    FormsModule,
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
    ToggleModule,
    MultiSelectBoxModule,
    CollapsibleModule,
    FiltersModule,
    OpenaiFormModule,
  ],
  exports: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent,
    MyCategoryComponent,
    MyArticleComponent,
  ],
  providers:[
    MyArticlesViewRouteResolver,
    MyCategoriesViewRouteResolver,
  ]
})
export class DashboardModule { }
