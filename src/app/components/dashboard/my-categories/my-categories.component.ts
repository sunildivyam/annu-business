import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ArticlesFirebaseService, Category, UtilsService } from '@annu/ng-lib';
import { filter } from 'rxjs';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit {
  categories: Array<Category> = [];
  filteredCategories: Array<Category> = [];
  searchKeys: Array<string> = ['name', 'title'];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private articlesFireSvc: ArticlesFirebaseService,
    public utilsSvc: UtilsService) {

      this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
        if (!this.route.firstChild) {
          this.getCategories();
        }
      })
    }

  ngOnInit(): void { }

  public async getCategories() {
    console.log('Fetching Categories');
    this.categories = await this.articlesFireSvc.getCategories({});
    this.filteredCategories = this.categories;
  }

  public onSearch(foundCategories: Array<Category>): void {
    this.filteredCategories = foundCategories;
  }
}
