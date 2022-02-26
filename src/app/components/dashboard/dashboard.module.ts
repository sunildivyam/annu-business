import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MyCategoriesComponent } from './my-categories/my-categories.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { RouterModule } from '@angular/router';
import { CardModule, CategoryEditorModule, ErrorModule, SearchBoxModule, TabsModule } from '@annu/ng-lib';
import { MyCategoryComponent } from './my-category/my-category.component';



@NgModule({
  declarations: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent,
    MyCategoryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    CardModule,
    SearchBoxModule,
    CategoryEditorModule,
    ErrorModule,
  ],
  exports: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent,
    MyCategoryComponent,
  ],
})
export class DashboardModule { }
