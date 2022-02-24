import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MyCategoriesComponent } from './my-categories/my-categories.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { RouterModule } from '@angular/router';
import { CardModule, TabsModule } from '@annu/ng-lib';



@NgModule({
  declarations: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    CardModule,
  ],
  exports: [
    DashboardComponent,
    MyCategoriesComponent,
    MyArticlesComponent
  ],
})
export class DashboardModule { }
