import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFirebaseService, Article, Category, MetaService, ArticlesFirebaseHttpService, FIREBASE_AUTH_ROLES, CategoriesFirebaseHttpService, UtilsService } from '@annu/ng-lib';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
const { appConfig } = environment;
const dashboardMyArticleMetaInfo = environment.dashboardConfig.dashboardMyArticleMetaInfo;
const imageSpecs = environment.libConfig.firebaseStoreConfig;

@Component({
  selector: 'app-my-article',
  templateUrl: './my-article.component.html',
  styleUrls: ['./my-article.component.scss']
})
export class MyArticleComponent implements OnInit, OnDestroy {
  article: Article | null = null;
  articleId: string = '';
  categories: Array<Category> = [];

  error: any = null;
  found: boolean = false;
  loading: boolean = true;
  paramsSubscription: Subscription;
  showUpdateConfirmationModal: boolean = false;
  ADD_ARTICLE: string = 'add';
  isAdmin: boolean = false;
  isAuthor: boolean = false;
  postfixUniqueId: boolean = true;
  showModal: boolean = false;
  imageHelpText: string = '';

  constructor(
    private articlesHttp: ArticlesFirebaseHttpService,
    private categoriesHttp: CategoriesFirebaseHttpService,
    private authFireSvc: AuthFirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private utilsSvc: UtilsService,
    private metaService: MetaService) {
    this.imageHelpText = this.utilsSvc.getImageSpecsString(imageSpecs);
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      this.error = null;
      this.found = true;
      this.articleId = params['id'];
      this.isAdmin = await this.authFireSvc.currentUserHasRole(FIREBASE_AUTH_ROLES.ADMIN);
      this.isAuthor = await this.authFireSvc.currentUserHasRole(FIREBASE_AUTH_ROLES.AUTHOR);
      this.getCategories();
      this.getArticle(this.articleId);
    });
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({ ...dashboardMyArticleMetaInfo, title: `${appConfig.metaInfo.title} - ${dashboardMyArticleMetaInfo.title}` });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  public get isNewArticlePage(): boolean {
    return this.articleId === this.ADD_ARTICLE;
  }

  public async getArticle(id: string) {
    this.error = null;
    this.loading = true;
    this.found = true;
    this.article = null;

    if (id !== this.ADD_ARTICLE) {
      const getArticlePromise: Promise<Article> = this.isAdmin ?
        this.articlesHttp.getArticle(id) :
        this.articlesHttp.getUsersArticle(this.authFireSvc.getCurrentUserId(), id);

      getArticlePromise.then((art: Article) => {
        if (art) {
          this.article = { ...art };
        } else {
          this.found = false;
          this.error = { code: '404', message: `Article does not exist - ${id}` };
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
      this.article = null;
    }
  }

  public async getCategories() {
    const pageCategories = await this.categoriesHttp.getAllUsersOnePageShallowCategories(this.isAdmin ? null : true);
    this.categories = pageCategories.categories || [];
  }

  public saveClicked(article: Article): void {
    this.article = { ...article };
    this.error = null;
    this.loading = true;
    let savePromise;
    if (this.isNewArticlePage) {
      savePromise = this.articlesHttp.addArticle(this.article);
    } else {
      savePromise = this.articlesHttp.updateArticle(this.article);
    }

    savePromise.then((art: Article) => {
      this.article = { ...art };
      this.loading = false;
      if (this.isNewArticlePage) {
        this.router.navigate([this.article.id], { relativeTo: this.route.parent });
      }
    })
      .catch(error => {
        this.error = error;
        this.loading = false;
      });
  }


  public isLiveClicked(article: Article): void {
    this.article = { ...article };
    this.error = null;
    this.loading = true;
    if (!this.isNewArticlePage) {
      this.articlesHttp.setArticleLive(this.article)
        .then((art: Article) => {
          this.article = { ...art };
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

  public inReviewClicked(article: Article): void {
    this.article = { ...article };
    this.error = null;
    this.loading = true;
    if (!this.isNewArticlePage) {
      this.articlesHttp.setArticleUpForReview(this.article)
        .then((art: Article) => {
          this.article = { ...art };
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
    this.articlesHttp.deleteArticle(this.article)
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
}
