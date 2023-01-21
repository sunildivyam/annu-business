import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Article, MetaInfo, MetaService, ArticleViewRouteData, ARTICLES_ROUTE_RESOLVER_DATA_KEYS } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';
import { appConfig } from '../../../config';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss']
})
export class ArticleViewComponent implements OnInit {
  article: Article | null = null;
  error: any = null;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute, private router: Router) {
      this.route.data.subscribe(data => this.initFromResolvedData(data));
    }

  ngOnInit(): void {
    this.initFromResolvedData(this.route.snapshot.data);
  }

  ngOnDestroy(): void {}

  private initFromResolvedData(data: any): void {
    const articleViewData: ArticleViewRouteData = { ...data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLE_VIEW] ?? null};
    this.article = { ...articleViewData?.article as Article ?? null};

    /*
    * if article not found and then redirect to home page.
    * That means when an article route exist and category route does not, then it does not redirect to home,
    * and shows this article route.
    */
    if (!this.article || !this.article.id) {
      const paramCategoryId = this.route.parent?.snapshot.paramMap.get('categoryId');
      const paramArticleId = this.route.snapshot.paramMap.get('articleId');
      this.router.navigateByUrl(`?categoryId=${paramCategoryId}&articleId=${paramArticleId}`, { skipLocationChange: true });
      return;
    }

    if (!this.route.firstChild) {
      this.metaService.setPageMeta({ ...this.article?.metaInfo as MetaInfo, title: `${appConfig.metaInfo.title} - ${this.article?.metaInfo?.title}` });
    }
  }
}
