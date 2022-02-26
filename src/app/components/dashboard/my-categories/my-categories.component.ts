import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ArticlesFirebaseService, AuthFirebaseService, Category, UtilsService } from '@annu/ng-lib';
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

  loading: boolean = true;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private articlesFireSvc: ArticlesFirebaseService,
    private authFireSvc: AuthFirebaseService,
    public utilsSvc: UtilsService) {

      this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
        this.loading = true;
      })

      this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
        if (!this.route.firstChild) {
          this.getCategories();
        } else {
          this.loading = false;
        }
      })
    }

  ngOnInit(): void { }

  public async getCategories() {
    this.categories = await this.articlesFireSvc.getCategories({userId: this.authFireSvc.getCurrentUserId()});
    this.filteredCategories = this.categories;
    this.loading = false;
  }

  public onSearch(foundCategories: Array<Category>): void {
    this.filteredCategories = foundCategories;
  }
}
