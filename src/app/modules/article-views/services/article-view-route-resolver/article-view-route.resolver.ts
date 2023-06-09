import {
  Inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { ArticleViewRouteData } from '../../interfaces/article-views.interface';

import { ArticlesFirebaseHttpService } from '@annubiz/ng-lib';
import { isPlatformServer } from '@angular/common';
import { AppDataService } from '../../../app-core/services/app-data.service';

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
export class ArticleViewRouteResolver {
  constructor(private appDataService: AppDataService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ArticleViewRouteData> {
    const routeData: ArticleViewRouteData = {};
    const articleId = route.params['articleId'];

    routeData.article = await this.appDataService.getArticleViewArticle(
      articleId
    );

    return routeData; // TODO: return boolean only, and not data as data will available from appDataService subscription
  }
}
