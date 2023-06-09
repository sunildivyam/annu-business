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
import { AppDataService } from '../../../app-core/services/app-data.service';

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
    private appDataService: AppDataService,
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

    // Get homeViewCategoryGroups, if directly landed on this view.
    routeData.pageCategoryGroups =
      await this.appDataService.getHomeViewCategoryGroups(pageSize);
    /*
     * if category belongs to systemonly (meaning always offline, but their articles are live, e.g. helpdocs etc.)
     * Then there is no need to make a call to fetch it.
     */
    if (
      [
        CategoryFeatures.helpDocs,
        CategoryFeatures.privacy,
        CategoryFeatures.tnc,
        CategoryFeatures.aboutUs,
        CategoryFeatures.contactUs,
        CategoryFeatures.vision,
      ].includes(categoryId)
    ) {
      routeData.pageCategoryGroup = null;
    } else {
      routeData.pageCategoryGroup =
        await this.appDataService.getCategoryViewCategoryGroup(
          categoryId,
          pageSize,
          this.utilsSvc.totalTimeStringToUTCdateString(currentStartPage),
          pageDir === PageDirection.BACKWARD ? false : true
        );
    }

    return routeData; // TODO: return boolean only, and not data as data will available from appDataService subscription
  }
}
