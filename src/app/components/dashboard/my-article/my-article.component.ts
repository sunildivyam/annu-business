import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesFirebaseService, AuthFirebaseService, Article, QueryConfig, Category, MetaService } from '@annu/ng-lib';
import { Subscription } from 'rxjs';
import { appConfig, dashboardMyArticleMetaInfo } from '../../../config';

const ADD_ARTICLE = 'add';

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

  constructor(
    private articlesFireSvc: ArticlesFirebaseService,
    private authFireSvc: AuthFirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService) {

    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      this.error = null;
      this.found = true;
      this.articleId = params['id'];

      this.getArticle(this.articleId);
      this.getCategories();
    });
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({ ...dashboardMyArticleMetaInfo, title: `${appConfig.metaInfo.title} - ${dashboardMyArticleMetaInfo.title}` });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  public async getArticle(id: string) {
    this.error = null;
    this.loading = true;

    if (id && id !== ADD_ARTICLE) {
      const queryConfig: QueryConfig = {
        id,
        userId: this.authFireSvc.getCurrentUserId()
      }

      try {
        const foundArticles = await this.articlesFireSvc.getArticles(queryConfig);
        if (foundArticles.length) {
          this.found = true;
          this.article = foundArticles[0];
        } else {
          this.found = false;
          this.error = { code: '404', message: `Article does not exist - ${id}` }
        }

        this.loading = false;
      } catch (error) {
        this.found = false;
        this.loading = false;
        this.error = error;
      }
    } else {
      this.found = true;
      this.article = null;
      this.loading = false;
    }
  }

  public async getCategories() {
    try {
      const queryConfig: QueryConfig = {
        isLive: true
      };

      this.categories = await this.articlesFireSvc.getCategories(queryConfig);

      this.loading = false;
    } catch (error: any) {
      this.loading = false;
      this.error = error;
    }
  }

  private async updateArticle() {
    this.error = null;
    this.loading = true;

    try {
      const updatedArticle = await this.articlesFireSvc.setArticle(this.article as Article);
      this.article = updatedArticle;
      this.loading = false;

      if (this.articleId === ADD_ARTICLE || this.article.id !== this.articleId) {
        this.router.navigate([updatedArticle.id], { relativeTo: this.route.parent });
      }

    } catch (error: any) {
      this.error = error;
      this.loading = false;
    }
  }

  public saveArticle(article: Article) {
    this.article = { ...article };
    if (this.articleId !== ADD_ARTICLE && this.article.id !== this.articleId) {
      // Title has been changed, hence id has been chaged, means you are going to add a new article, probably a duplicate with different title.
      this.showUpdateConfirmationModal = true;
    } else {
      this.updateArticle();
    }
  }

  public onDuplicateArticleAction(event: any, isYes: boolean = false): void {
    event.preventDefault();
    this.showUpdateConfirmationModal = false;
    if (isYes) {
      this.updateArticle();
    }
  }
}
