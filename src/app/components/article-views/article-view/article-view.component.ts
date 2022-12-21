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

  routeEndEvent: Subscription;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute, private router: Router) {
    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      const articleViewData: ArticleViewRouteData = { ...this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLE_VIEW] } || {};
      this.article = { ...articleViewData.article as Article };

      // if category not found, redirect to home page.
      if (!this.article || !this.article.id) {
        const paramCategoryId = this.route.parent?.snapshot.paramMap.get('categoryId');
        const paramArticleId = this.route.snapshot.paramMap.get('articleId');
        this.router.navigateByUrl(`?categoryId=${paramCategoryId}&articleId=${paramArticleId}`, { skipLocationChange: true });
      }

      this.error = articleViewData.errorArticle;

      if (!this.route.firstChild) {
        this.metaService.setPageMeta({ ...this.article?.metaInfo as MetaInfo, title: `${appConfig.metaInfo.title} - ${this.article?.metaInfo?.title}` });
      }
    })
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }
}
