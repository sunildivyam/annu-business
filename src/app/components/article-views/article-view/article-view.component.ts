import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, ArticlesFirebaseService, QueryConfig } from '@annu/ng-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss']
})
export class ArticleViewComponent implements OnInit {
  article: Article | null = null;
  articleId: string = '';

  error: any = null;
  loading: boolean = true;
  paramsSubscription: Subscription;

  constructor(
    private articlesFireSvc: ArticlesFirebaseService,
    private route: ActivatedRoute,
    private router: Router) {

    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      this.articleId = params['articleId'];
      this.getArticle(this.articleId);
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  public async getArticle(id: string) {
    this.error = null;
    this.loading = true;

    const queryConfig: QueryConfig = {
      id: this.articleId,
      isLive: true,
    }

    try {
      const foundArticles = await this.articlesFireSvc.getArticles(queryConfig);
      if (foundArticles && foundArticles.length) {
        this.article = foundArticles[0];
      } else {
        this.error = { code: '404', message: `Page does not exist - ${id}` }
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.error = error;
    }
  }
}
