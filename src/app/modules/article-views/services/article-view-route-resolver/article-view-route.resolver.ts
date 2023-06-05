import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { ArticleViewRouteData } from '../../interfaces/article-views.interface';

import { ArticlesFirebaseHttpService } from '@annubiz/ng-lib';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

/**
 * Article view data resolver.
 * This requires BrowserTransferStateModule to be imported in app module and
 * ServerTransferStateModule in to the server.app module.
 * @date 15/3/2022 - 10:51:41 pm
 *
 * @export
 * @class ArticleViewRouteResolver
 * @typedef {ArticleViewRouteResolver}
 * @implements {Resolve<ArticleViewRouteData>}
 */
@Injectable()
export class ArticleViewRouteResolver  {

  routeData: ArticleViewRouteData = {};

  constructor(private articlesFireHttp: ArticlesFirebaseHttpService, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ArticleViewRouteData> {
    this.routeData = {};
    const articleId = route.params['articleId'];
    // create a unique key that holds the route stata data.
    const ARTICLE_VIEW_ROUTE_KEY = makeStateKey<ArticleViewRouteData>('article-view-route-' + articleId);

    //Check if state data already exists, if yes, serve it from state, and clear the state else, fetch the data and set it to state, that can be used at client side.
    if (this.transferState.hasKey(ARTICLE_VIEW_ROUTE_KEY)) {
      this.routeData = this.transferState.get<ArticleViewRouteData>(ARTICLE_VIEW_ROUTE_KEY, {});
      this.transferState.remove(ARTICLE_VIEW_ROUTE_KEY);
    } else {
      this.routeData.article = await this.articlesFireHttp.getLiveArticle(articleId).catch(() => null);

      if (isPlatformServer(this.platformId)) {
        this.transferState.set(ARTICLE_VIEW_ROUTE_KEY, this.routeData);
      }
    }

    return this.routeData;
  }
}
