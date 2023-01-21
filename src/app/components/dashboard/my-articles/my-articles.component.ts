import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Article, MetaService, PageArticles, ARTICLES_ROUTE_RESOLVER_DATA_KEYS } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';
import { appConfig, dashboardMyArticlesMetaInfo } from '../../../config';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnInit, OnDestroy {
  articles: Array<Article> = [];
  filteredArticles: Array<Article> = [];
  searchKeys: Array<string> = ['id', 'metaInfo.title'];

  loading: boolean = true;
  error: any;
  routeStartEvent: Subscription;
  routeEndEvent: Subscription;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService) {

    this.routeStartEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
      this.loading = true;
      this.error = null;
    });

    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      this.loading = false;
    });

    this.route.data.subscribe(data => {
      const pageArticles: PageArticles = data[ARTICLES_ROUTE_RESOLVER_DATA_KEYS.MY_ARTICLES_VIEW];
      this.articles = pageArticles?.articles || [];
      this.filteredArticles = this.articles;
      this.loading = false;
    })
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({ ...dashboardMyArticlesMetaInfo, title: `${appConfig.metaInfo.title} - ${dashboardMyArticlesMetaInfo.title}` });
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }

  public onSearch(foundArticles: Array<Article>): void {
    this.filteredArticles = foundArticles;
  }
}
