import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MyCategoriesComponent } from './my-categories/my-categories.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';



@NgModule({
  declarations: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent
  ],
})
export class DashboardModule { }
