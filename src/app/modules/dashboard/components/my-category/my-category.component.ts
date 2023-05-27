import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFirebaseService, Category, MetaService, CategoriesFirebaseHttpService, FIREBASE_AUTH_ROLES, UtilsService } from '@annu/ng-lib';
import { Subscription } from 'rxjs';

import { environment } from '../../../../../environments/environment';
const { appConfig } = environment;
const dashboardMyCategoryMetaInfo = environment.dashboardConfig.dashboardMyCategoryMetaInfo;
const imageSpecs = environment.libConfig.firebaseStoreConfig;

@Component({
  selector: 'app-my-category',
  templateUrl: './my-category.component.html',
  styleUrls: ['./my-category.component.scss']
})
export class MyCategoryComponent implements OnInit, OnDestroy {
  readonly ADD_CATEGORY = 'add';
  category!: Category | null;
  categoryId: string = '';

  error: any = null;
  found: boolean = false;
  loading: boolean = true;
  paramsSubscription: Subscription;
  userRoles: Array<string> = [];
  isAdmin: boolean = false;
  isAuthor: boolean = false;
  postfixUniqueId: boolean = true;
  showModal: boolean = false;
  imageHelpText: string = '';

  constructor(
    private categoriesHttp: CategoriesFirebaseHttpService,
    private authFireSvc: AuthFirebaseService,
    private utilsSvc: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService) {
    this.imageHelpText = this.utilsSvc.getImageSpecsString(imageSpecs);
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategory(this.categoryId);
    });
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({ ...dashboardMyCategoryMetaInfo, title: `${appConfig.metaInfo.title} - ${dashboardMyCategoryMetaInfo.title}` });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  public get isNewCategoryPage(): boolean {
    return this.categoryId === this.ADD_CATEGORY;
  }

  public async getCategory(id: string) {
    this.error = null;
    this.loading = true;
    this.found = true;
    this.category = null;
    this.userRoles = await this.authFireSvc.getCurrentUserRoles();
    this.isAdmin = this.userRoles.includes(FIREBASE_AUTH_ROLES.ADMIN);
    this.isAuthor = this.userRoles.includes(FIREBASE_AUTH_ROLES.AUTHOR);

    if (id !== this.ADD_CATEGORY) {
      const getCategoryPromise: Promise<Category> = this.isAdmin ?
        this.categoriesHttp.getCategory(id) :
        this.categoriesHttp.getUsersCategory(this.authFireSvc.getCurrentUserId(), id);

      getCategoryPromise.then((cat: Category) => {
        if (cat) {
          this.category = { ...cat };
        } else {
          this.found = false;
          this.error = { code: '404', message: `Category does not exist - ${id}` };
        }

        this.loading = false;
      })
        .catch(error => {
          this.error = error;
          this.loading = false;
          this.found = false;
        });
    } else {
      this.found = true;
      this.loading = false;
    }
  }

  public saveClicked(category: Category): void {
    this.category = { ...category };
    this.error = null;
    this.loading = true;
    let savePromise;
    if (this.isNewCategoryPage) {
      savePromise = this.categoriesHttp.addCategory(this.category);
    } else {
      savePromise = this.categoriesHttp.updateCategory(this.category);
    }

    savePromise.then((cat: Category) => {
      this.category = { ...cat };
      this.loading = false;
      if (this.isNewCategoryPage) {
        this.router.navigate([this.category.id], { relativeTo: this.route.parent });
      }
    })
      .catch(error => {
        this.error = error;
        this.loading = false;
      });
  }

  public isLiveClicked(category: Category): void {
    this.category = { ...category };
    this.error = null;
    this.loading = true;
    if (!this.isNewCategoryPage) {
      this.categoriesHttp.setCategoryLive(this.category)
        .then((cat: Category) => {
          this.category = { ...cat };
          this.loading = false;
        })
        .catch(error => {
          this.error = error;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  public inReviewClicked(category: Category): void {
    this.category = { ...category };
    this.error = null;
    this.loading = true;
    if (!this.isNewCategoryPage) {
      this.categoriesHttp.setCategoryUpForReview(this.category)
        .then((cat: Category) => {
          this.category = { ...cat };
          this.loading = false;
        })
        .catch(error => {
          this.error = error;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  public deleteClicked(category: Category): void {
    this.showModal = true;
  }


  public deleteCancelled(): void {
    this.showModal = false;
  }

  public deleteConfirmed(): void {
    this.showModal = false;
    this.loading = true;
    this.error = null;
    this.categoriesHttp.deleteCategory(this.category)
      .then(success => {
        if (success === true) {
          this.router.navigate(['.'], { relativeTo: this.route.parent });
        } else {
          throw new Error('Something went wrong, please try again later.');
        }
        this.loading = false;
      })
      .catch(error => {
        this.error = error;
        this.loading = false;
      });
  }

  public categoryChanged(category: Category): void {
    category.metaInfo.site_name = appConfig.metaInfo.title;
    category.metaInfo['article:author'] = category.metaInfo['article:author'] || appConfig.metaInfo['article:author'];
    category.metaInfo.author = category.metaInfo.author || appConfig.metaInfo.author;
    category.metaInfo.image = category.image?.src || '';
    category.metaInfo.url = `${environment.libConfig.apiBaseUrl}/${category.id}`;
  }
}
