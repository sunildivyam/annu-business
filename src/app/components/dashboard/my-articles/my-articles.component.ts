import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ArticlesFirebaseService, AuthFirebaseService, Article, QueryConfig, UtilsService } from '@annu/ng-lib';
import { filter, Subscription } from 'rxjs';

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
    private articlesFireSvc: ArticlesFirebaseService,
    private authFireSvc: AuthFirebaseService) {

    this.routeStartEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationStart)).subscribe(() => {
      this.loading = true;
      this.error = null;
    })

    this.routeEndEvent = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      if (!this.route.firstChild) {
        this.getArticles();
      } else {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }

  public async getArticles() {
    try {
      const queryConfig: QueryConfig = {
        userId: this.authFireSvc.getCurrentUserId()
      };
      this.articles = await this.articlesFireSvc.getArticles(queryConfig);
      this.filteredArticles = this.articles;
      this.loading = false;
    } catch (error: any) {
      this.loading = false;
      this.error = error;
    }
  }

  public onSearch(foundArticles: Array<Article>): void {
    this.filteredArticles = foundArticles;
  }
}
