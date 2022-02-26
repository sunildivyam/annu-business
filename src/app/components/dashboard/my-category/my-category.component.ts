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
  category!: Category | null;
  categoryId: string = '';

  error: any = null;
  found: boolean = false;
  loading: boolean = true;

  constructor(
    private articlesFireSvc: ArticlesFirebaseService,
    private authFireSvc: AuthFirebaseService,
    private route: ActivatedRoute,
    private router: Router) {

    this.route.params.subscribe(params => {
      this.error = null;
      this.found = true;
      this.categoryId = params['id'];
      this.getCategory(this.categoryId);
    });
  }

  ngOnInit(): void { }

  public async getCategory(id: string) {
    this.error = null;
    this.loading = true;

    if (id && id !== ADD_CATEGORY) {
      const queryConfig: QueryConfig = {
        id,
        userId: this.authFireSvc.getCurrentUserId()
      }

      try {
        const foundCategories = await this.articlesFireSvc.getCategories(queryConfig);
        if (foundCategories.length) {
          this.found = true;
          this.category = foundCategories[0];
        } else {
          this.found = false;
          this.error = { code: '404', message: `Category does not exist - ${id}` }
        }

        this.loading = false;
      } catch (error) {
        this.found = false;
        this.loading = false;
        this.error = error;
      }
    } else {
      this.found = true;
      this.category = null;
      this.loading = false;
    }
  }

  private async updateCategory() {
    this.error = null;
    this.loading = true;

    try {
      const updatedCat = await this.articlesFireSvc.setCategory(this.category as Category);
      this.category = updatedCat;
      this.loading = false;

      if (this.categoryId === ADD_CATEGORY || this.category.id !== this.categoryId) {
        this.router.navigate([updatedCat.id], { relativeTo: this.route.parent });
      }

    } catch (error: any) {
      this.error = error;
      this.loading = false;
    }
  }

  public saveCategory(category: Category) {
    this.category = category;
    this.updateCategory();
  }
}
