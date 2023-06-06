import {
  Inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import {
  CategoryViewRouteData,
  ArticlesHomeViewRouteData,
  PageDirection,
} from '../../interfaces/article-views.interface';

import {
  CategoriesFirebaseHttpService,
  CategoryFeatures,
  UtilsService,
} from '@annubiz/ng-lib';
import { isPlatformServer } from '@angular/common';

import {
  ARTICLE_VIEWS_ROUTE_RESOLVER_DATA_KEYS,
  ROUTE_PARAM_NAMES,
} from '../../constants/article-views.constants';

// Resolver should get pageSize from the route.data.pageSize, or this page size will be set.
const DEFAULT_PAGE_SIZE = 5;

/**
 * Category view data resolver.
 * This requires BrowserTransferStateModule to be imported in app module and
 * ServerTransferStateModule in to the server.app module.
 * @date 15/3/2022 - 10:51:12 pm
 *
 * @export
 * @class CategoryViewRouteResolver
 * @typedef {CategoryViewRouteResolver}
 * @implements {Resolve<CategoryViewRouteData>}
 */
@Injectable()
export class CategoryViewRouteResolver {
  constructor(
    private categoriesFireHttp: CategoriesFirebaseHttpService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId,
    private utilsSvc: UtilsService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<CategoryViewRouteData> {
    let routeData: CategoryViewRouteData = {};
    const categoryId = route.params[ROUTE_PARAM_NAMES.CATEGORY_ID];
    const currentStartPage = route.queryParams[ROUTE_PARAM_NAMES.START_PAGE];
    const pageDir: PageDirection =
      route.queryParams[ROUTE_PARAM_NAMES.PAGE_DIRECTION];
    const pageSize = route?.data?.pageSize || DEFAULT_PAGE_SIZE;

    // create a unique key that holds the route stata data.
    const stateKeyName =
      'category-view-route-' +
      categoryId +
      (currentStartPage || '') +
      (pageDir || '');
    const CATEGORY_VIEW_ROUTE_KEY =
      makeStateKey<CategoryViewRouteData>(stateKeyName);

    //Check if state data already exists, if yes, serve it from state, and clear the state else, fetch the data and set it to state, that can be used at client side.
    if (this.transferState.hasKey(CATEGORY_VIEW_ROUTE_KEY)) {
      routeData = this.transferState.get<CategoryViewRouteData>(
        CATEGORY_VIEW_ROUTE_KEY,
        {}
      );
      this.transferState.remove(CATEGORY_VIEW_ROUTE_KEY);
    } else {
      // populate some of the data that is already available on parent route.
      const parentRouteData: ArticlesHomeViewRouteData =
        route.parent.data[
          ARTICLE_VIEWS_ROUTE_RESOLVER_DATA_KEYS.ARTICLES_HOME_VIEW
        ];
      if (parentRouteData) {
        routeData.pageCategoryGroups =
          parentRouteData?.pageCategoryGroups || null;
      } else {
        routeData.pageCategoryGroups = await this.categoriesFireHttp
          .getAllLiveCategoriesWithOnePageShallowArticles()
          .catch(() => null);
      }

      /*
       * if category belongs to systemonly (meaning always offline, but their articles are live, e.g. helpdocs etc.)
       * Then there is no need to make a call to fetch it.
       */
      if (
        [
          CategoryFeatures.helpDocs,
          CategoryFeatures.privacy,
          CategoryFeatures.tnc,
        ].includes(categoryId)
      ) {
        routeData.pageCategoryGroup = null;
      } else {
        routeData.pageCategoryGroup = await this.categoriesFireHttp
          .getLiveCategoryWithOnePageShallowArticles(
            categoryId,
            pageSize,
            this.utilsSvc.totalTimeStringToUTCdateString(currentStartPage),
            pageDir === PageDirection.BACKWARD ? false : true
          )
          .catch(() => null);
      }

      if (isPlatformServer(this.platformId)) {
        this.transferState.set(CATEGORY_VIEW_ROUTE_KEY, routeData);
      }
    }

    return routeData;
  }
}
