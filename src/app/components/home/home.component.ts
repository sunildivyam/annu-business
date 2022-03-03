import { Component, OnInit } from '@angular/core';
import { Article, ArticlesFirebaseService, Category, QueryConfig } from '@annu/ng-lib';

const FEATURED_CATEGORIES_COUNT = 4;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_DESCRIPTION_CHAR_COUNT = 300;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredCategories: Array<Category> = [];
  allCategories: Array<Category> = [];
  allCategoryArticles: Array<any> = [];
  descriptionCharCount: number = DEFAULT_DESCRIPTION_CHAR_COUNT;

  constructor(private articlesFireSvc: ArticlesFirebaseService) { }

  ngOnInit(): void {
    this.loadPageData();
  }

  private async loadPageData() {
    this.allCategories = await this.articlesFireSvc.getCategories({isLive: true, orderField: 'updated'})
    // Extracts 1st few categories as featured categories.

    this.featuredCategories = this.allCategories.slice(0, FEATURED_CATEGORIES_COUNT);
    this.allCategories.forEach(async (cat: Category) => {
      const articles = await this.articlesFireSvc.getArticles({isLive: true, articleCategoryId: cat.id, orderField: 'updated', pageSize: DEFAULT_PAGE_SIZE, isNextPages: true, startPage: null});
      this.allCategoryArticles.push(
        {
          category: cat,
          articles: articles || []
        });
    });
  }
}
