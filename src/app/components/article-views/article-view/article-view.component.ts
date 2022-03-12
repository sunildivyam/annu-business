import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article, MetaInfo, MetaService, ArticleViewRouteData, ARTICLES_ROUTE_RESOLVER_DATA_KEYS } from '@annu/ng-lib';


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
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const articleViewData: ArticleViewRouteData = this.route.snapshot.data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.ARTICLE_VIEW] || {};
    this.article = articleViewData.article as Article;
    this.error = articleViewData.errorArticle;
    this.metaService.setPageMeta(this.article?.metaInfo as MetaInfo);
  }

}
