import { Component, OnInit } from '@angular/core';
import { Article, ArticlesFirebaseService, Category, QueryConfig } from '@annu/ng-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredCategories: Array<Category> = [];
  allCategoryArticles: Array<any> = [];

  constructor(private articleFireSvc: ArticlesFirebaseService) { }

  ngOnInit(): void {
    this.loadPageData();
  }

  private async loadPageData() {
    this.featuredCategories = await this.articleFireSvc.getCategories({isLive: true, orderField: 'updated', pageSize: 4, isNextPages: true, startPage: null})
    this.featuredCategories.forEach(async (cat: Category) => {
      const articles = await this.articleFireSvc.getArticles({isLive: true, articleCategoryId: cat.id, orderField: 'updated', pageSize: 5, isNextPages: true, startPage: null});
      this.allCategoryArticles.push(
        {
          category: cat,
          articles: articles || []
        });
    });
  }
}
