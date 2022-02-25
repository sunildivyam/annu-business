import { Component, OnInit } from '@angular/core';
import { ArticlesFirebaseService, Category } from '@annu/ng-lib';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit {
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  searchKeys: Array<string> = ['name', 'title'];

  constructor(private articlesFireSvc: ArticlesFirebaseService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  public async getCategories() {
    this.categories = await this.articlesFireSvc.getCategories({});
    this.filteredCategories = this.categories;
  }

  public onSearch(foundCategories: Array<Category>): void {
    this.filteredCategories = foundCategories;
  }
}
