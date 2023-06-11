import {
  Inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  StateKey,
  TransferState,
} from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ArticlesHomeViewRouteData } from '../../interfaces/article-views.interface';

import { CategoriesFirebaseHttpService } from '@annubiz/ng-lib';
import { isPlatformServer } from '@angular/common';
import { AppDataService } from '../../../app-core/services/app-data.service';

const DEFAULT_PAGE_SIZE = 5;

/**
 * Articles Home view data resolver.
 * This requires BrowserTransferStateModule to be imported in app module and
 * ServerTransferStateModule in to the server.app module.
 * @date 15/3/2022 - 10:48:34 pm
 *
 * @export
 * @class ArticlesHomeViewRouteResolver
 * @typedef {ArticlesHomeViewRouteResolver}
 * @implements {Resolve<ArticlesHomeViewRouteData>}
 */
@Injectable()
export class ArticlesHomeViewRouteResolver {
  pageSize: number = DEFAULT_PAGE_SIZE;

  constructor(private appDataService: AppDataService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ArticlesHomeViewRouteData> {
    let routeData: ArticlesHomeViewRouteData = {};
    this.pageSize = route?.data?.pageSize || DEFAULT_PAGE_SIZE;

    const categoryGroupsPrromise =
      this.appDataService.getHomeViewCategoryGroups(this.pageSize);
    const primeShowArticlesPromise = this.appDataService.getPrimeShowArticles();
    const footerShowArticlesPromise =
      this.appDataService.getFooterShowArticles();

    const promisesResult = await Promise.all([
      categoryGroupsPrromise,
      primeShowArticlesPromise,
      footerShowArticlesPromise,
    ]);

    routeData.pageCategoryGroups = promisesResult[0];
    routeData.primeShowArticles = promisesResult[1];
    routeData.footerShowArticles = promisesResult[2];

    return routeData;
  }
}
