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

  constructor(
    private categoryFireHttp: CategoriesFirebaseHttpService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ArticlesHomeViewRouteData> {
    let routeData: ArticlesHomeViewRouteData = {};
    this.pageSize = route?.data?.pageSize || DEFAULT_PAGE_SIZE;

    // create a unique key that holds the route stata data.
    const HOME_VIEW_ROUTE_KEY = makeStateKey<ArticlesHomeViewRouteData>(
      'articles-home-view-route'
    );

    //Check if state data already exists, if yes, serve it from state, and clear the state else, fetch the data and set it to state, that can be used at client side.
    if (this.transferState.hasKey(HOME_VIEW_ROUTE_KEY)) {
      routeData = this.transferState.get<ArticlesHomeViewRouteData>(
        HOME_VIEW_ROUTE_KEY,
        {}
      );
      this.transferState.remove(HOME_VIEW_ROUTE_KEY);
    } else {
      // Fetch the fresh data and set the new transferState for mext use.
      routeData.pageCategoryGroups =
        await this.categoryFireHttp.getAllLiveCategoriesWithOnePageShallowArticles(
          this.pageSize
        );
      this.setTransferState(HOME_VIEW_ROUTE_KEY, routeData);
    }

    return routeData;
  }

  private setTransferState(
    key: StateKey<ArticlesHomeViewRouteData>,
    routeData: ArticlesHomeViewRouteData
  ): void {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(key, routeData);
    }
  }
}
