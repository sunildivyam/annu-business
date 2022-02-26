import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesFirebaseService, AuthFirebaseService, Category, QueryConfig } from '@annu/ng-lib';

const ADD_CATEGORY = 'add';

@Component({
  selector: 'app-my-category',
  templateUrl: './my-category.component.html',
  styleUrls: ['./my-category.component.scss']
})
export class MyCategoryComponent implements OnInit {
  category: Category | null = null;
  categoryName: string = '';

  error: any = null;
  saveSuccess: boolean = true;

  constructor(
    private articlesFireSvc: ArticlesFirebaseService,
    private authFireSvc: AuthFirebaseService,
    private route: ActivatedRoute,
    private router: Router) {

    this.route.params.subscribe(params => {
      this.categoryName = params['name'];
      this.getCategory(this.categoryName);
    });
  }

  ngOnInit(): void { }

  public async getCategory(catName: string) {
    this.error = null;

    if (catName === ADD_CATEGORY) {
      this.category = {
        name: 'sample-category',
        title: 'Sample category',
        description: 'Sample Description',
        isLive: false,
      }
    } else {
      const queryConfig: QueryConfig = {
        name: catName,
        userId: this.authFireSvc.getCurrentUserId()
      }
      try {
        const foundCategories = await this.articlesFireSvc.getCategories(queryConfig);
        if (foundCategories.length) {
          this.category = foundCategories[0];
        } else {
          this.category = null;
          this.error = { code: '404', message: `Category does not exist - ${catName}` }
        }
      } catch (error) {
        this.category = null;
        this.error = error;
      }
    }
  }

  public categoryChanged(category: Category): void {
    this.category = category;
  }

  private async addCategory() {
    try {
      const addedCat = await this.articlesFireSvc.addCategory(this.category as Category);
      this.saveSuccess = true;
      this.router.navigate([addedCat.name], {relativeTo: this.route});
    } catch (error: any) {
      this.error = error;
    }
  }

  private async updateCategory() {
    try {
      const updatedCat = await this.articlesFireSvc.setCategory(this.category as Category);
      this.category = updatedCat;
      this.saveSuccess = true;
    } catch (error: any) {
      this.error = error;
    }
  }

  public async saveCategory(event: any) {
    event.preventDefault();
    this.error = null;
    this.saveSuccess = false;

    if (this.categoryName === ADD_CATEGORY) {
      this.addCategory();
    } else {
      this.updateCategory();
    }
  }
}
