import {
  Inject,
  Injectable,
  PLATFORM_ID,
  StateKey,
  TransferState,
  makeStateKey,
} from '@angular/core';
import {
  Article,
  ArticleFeatures,
  ArticlesFirebaseHttpService,
  CategoriesFirebaseHttpService,
  Category,
  CategoryFeatures,
  PageArticles,
  PageCategoryGroup,
  UtilsService,
} from '@annubiz/ng-lib';
import {
  AppState,
  AppStateRequestOptions,
  AppStateValue,
  StateKeys,
} from '../interfaces/app-core.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { APP_STATE_KEYS } from '../constants/app-core.constants';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  private appState$: BehaviorSubject<AppState>;
  private stateKeys: StateKeys;

  // additional cache
  private _pageCategoryGroups: Array<PageCategoryGroup> = [];
  private _articles: Array<Article> = [];

  constructor(
    private utils: UtilsService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string,
    private categoriesHttp: CategoriesFirebaseHttpService,
    private articlesHttp: ArticlesFirebaseHttpService
  ) {
    this.initAppState();
  }

  /**
   * Initializes appState with default values
   * @date 6/8/2023 - 4:00:24 PM
   *
   * @private
   */
  private initAppState(): void {
    // Make statekays ready for SSR
    this.stateKeys = {};
    const stateKeysArr = Object.values(APP_STATE_KEYS);
    stateKeysArr.forEach((value) => {
      this.stateKeys[value] = makeStateKey<AppStateValue>(value);
    });

    this.appState$ = new BehaviorSubject<AppState>({});
  }

  /**
   * Saves a stateKey and its data to SSR state.
   * @date 6/8/2023 - 3:59:58 PM
   *
   * @private
   * @param {StateKey<Array<Category>>} key
   * @param {Array<Category>} data
   */
  private saveToSsrState(
    key: StateKey<AppStateValue>,
    data: AppStateValue
  ): void {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(key, data);
    }
  }

  /**
   * Removes a stateKey and its data from SSR state.
   * @date 6/8/2023 - 3:59:32 PM
   *
   * @private
   * @param {StateKey<Array<Category>>} key
   */
  private removeFromSsrState(key: StateKey<AppStateValue>): void {
    if (isPlatformBrowser(this.platformId)) {
      this.transferState.remove(key);
    }
  }

  private catchFn(err) {
    return null;
  }

  private deepCheckAppStateItemValue(
    appStateItemValue: AppStateValue,
    options: AppStateRequestOptions = null
  ): AppStateValue {
    if (!options) return appStateItemValue;

    const { categoryId, articleId, startPage } = options;

    let checkPass = false;

    if (categoryId) {
      const aCondition =
        (appStateItemValue as PageCategoryGroup)?.category?.id === categoryId;
      const bCondition =
        (appStateItemValue as PageCategoryGroup)?.pageArticles?.endPage ==
        startPage;
      if (aCondition && bCondition) checkPass = true;
    } else if (articleId) {
      checkPass = (appStateItemValue as Article)?.id === articleId;
    } else {
      checkPass = true;
    }

    return checkPass ? appStateItemValue : null;
  }

  /**
   * Gets AppStateItemvalue from cache or SSR
   * @date 6/8/2023 - 7:20:37 PM
   *
   * @private
   * @async
   * @param {string} appStateItemName
   * @returns {Promise<AppStateValue>}
   */
  private async getAppStateItemValueFromCacheOrSSRState(
    appStateItemName: string,
    options: AppStateRequestOptions = null
  ): Promise<AppStateValue> {
    const stateKey = this.stateKeys[appStateItemName];

    // serve it from cache, if available.

    let appStateItemValue: AppStateValue = this.utils.deepCopy(
      this.appState$.value[appStateItemName]
    );

    // Check deeply for availabily based on available options(catid, artid, startPage, etc.)
    appStateItemValue = this.deepCheckAppStateItemValue(
      appStateItemValue,
      options
    );
    if (appStateItemValue) {
      return appStateItemValue;
    }

    // Else Serve from SSR transferState, if available and save to cache
    if (this.transferState.hasKey(stateKey)) {
      appStateItemValue = this.transferState.get(stateKey, null);
      appStateItemValue = this.deepCheckAppStateItemValue(
        appStateItemValue,
        options
      );
      if (appStateItemValue) {
        // Save to cache
        this.appState$.next({
          ...this.utils.deepCopy(this.appState$.value),
          [appStateItemName]: appStateItemValue,
        });
        // Remove from SSR
        this.removeFromSsrState(stateKey);
        return appStateItemValue;
      }
    }

    return appStateItemValue;
  }

  /**
   * Gets AppStateItemvalue from REST
   * @date 6/8/2023 - 7:21:04 PM
   *
   * @private
   * @async
   * @param {string} appStateItemName
   * @returns {Promise<AppStateValue>}
   */
  private async getAppStateItemValue(
    appStateItemName: string,
    options: AppStateRequestOptions = null
  ): Promise<AppStateValue> {
    let allLiveCategories: Array<Category>;

    // serve from cache or SSR
    let appStateItemValue = await this.getAppStateItemValueFromCacheOrSSRState(
      appStateItemName,
      options
    ).catch(this.catchFn);

    if (appStateItemValue) return appStateItemValue;

    // Else serve from from DB
    switch (appStateItemName) {
      case APP_STATE_KEYS.allLiveCategories:
        appStateItemValue = await this.categoriesHttp
          .getAllLiveShallowCategories()
          .catch(this.catchFn);

        break;
      case APP_STATE_KEYS.featuredCategories:
        allLiveCategories = (await this.getAppStateItemValue(
          APP_STATE_KEYS.allLiveCategories
        ).catch(this.catchFn)) as Array<Category>;

        appStateItemValue = allLiveCategories.filter((cat) => cat.isFeatured);
        break;
      case APP_STATE_KEYS.mainNavCategories:
        allLiveCategories = (await this.getAppStateItemValue(
          APP_STATE_KEYS.allLiveCategories
        ).catch(this.catchFn)) as Array<Category>;

        appStateItemValue = allLiveCategories.filter((cat) =>
          cat?.features?.includes(CategoryFeatures.primaryNavigation)
        );
        break;
      case APP_STATE_KEYS.footerNavCategories:
        allLiveCategories = (await this.getAppStateItemValue(
          APP_STATE_KEYS.allLiveCategories
        ).catch(this.catchFn)) as Array<Category>;

        appStateItemValue = allLiveCategories.filter((cat) =>
          cat?.features?.includes(CategoryFeatures.footerNavigation)
        );
        break;
      case APP_STATE_KEYS.homeViewCategoryGroups:
        const allCategories = (await this.getAppStateItemValue(
          APP_STATE_KEYS.allLiveCategories
        ).catch(this.catchFn)) as Array<Category>;

        appStateItemValue = (await this.articlesHttp
          .getLiveShallowArticlesOfCategories(allCategories, options?.pageSize)
          .catch(this.catchFn)) as Array<PageCategoryGroup>;
        break;
      case APP_STATE_KEYS.categoryViewCategoryGroup:
        /**
         * Check in homeViewCategoryGroups in cache or SSR, if available, look for categoryId.
         * Do not fetch homeViewCategoryGroups from DB, so call getAppStateItemValueFromCacheOrSSRState() only
         */

        const homeViewCategoryGroups =
          (await this.getAppStateItemValueFromCacheOrSSRState(
            APP_STATE_KEYS.homeViewCategoryGroups
          ).catch(this.catchFn)) as Array<PageCategoryGroup>;

        // Add additional cache to look in list
        const lookInCategoryGroups = [
          ...homeViewCategoryGroups,
          this._pageCategoryGroups,
        ] as Array<PageCategoryGroup>;

        appStateItemValue =
          lookInCategoryGroups &&
          lookInCategoryGroups.find(
            (pageCatGrp) =>
              pageCatGrp?.category?.id === options?.categoryId &&
              (!options?.startPage ||
                pageCatGrp?.pageArticles?.endPage == options?.startPage)
          );

        // if not available in homeviewCategoryGroups too, then fetch from db
        if (!appStateItemValue) {
          appStateItemValue = (await this.categoriesHttp
            .getLiveCategoryWithOnePageShallowArticles(
              options.categoryId,
              options?.pageSize,
              options?.startPage,
              options?.isForward
            )
            .catch(this.catchFn)) as PageCategoryGroup;

          // Save to additional cache
          this._pageCategoryGroups.push(appStateItemValue);
        }
        break;
      case APP_STATE_KEYS.articleViewArticle:
        // Look into additional cache
        appStateItemValue = this._articles.find(
          (article) => article?.id === options?.articleId
        );

        if (!appStateItemValue) {
          appStateItemValue = (await this.articlesHttp
            .getLiveArticle(options?.articleId)
            .catch(this.catchFn)) as Article;

          // Save to additional cache
          this._articles.push(appStateItemValue);
        }
        break;
      case APP_STATE_KEYS.primeShowArticles:
        appStateItemValue = (
          (await this.articlesHttp
            .getLiveOnePageShallowArticlesByFeatures([
              ArticleFeatures.primeShow,
            ])
            .catch(this.catchFn)) as PageArticles
        )?.articles;
        break;
      case APP_STATE_KEYS.footerShowArticles:
        appStateItemValue = (
          (await this.articlesHttp
            .getLiveOnePageShallowArticlesByFeatures([
              ArticleFeatures.footerShow,
            ])
            .catch(this.catchFn)) as PageArticles
        )?.articles;
        break;
      default:
      // NOTE: Add one separate switch case for each AppState items, above
    }

    if (appStateItemValue instanceof Array && !appStateItemValue.length) {
      appStateItemValue = null;
    }

    const copyOfappStateItemValue = this.utils.deepCopy(appStateItemValue);

    // Save to SSR
    this.saveToSsrState(
      this.stateKeys[appStateItemName],
      copyOfappStateItemValue
    );

    // Emit App State (It also saves copyOfappStateItemValue to cache)
    const newState = {
      ...this.utils.deepCopy(this.appState$.value),
      [appStateItemName]: copyOfappStateItemValue,
    };
    this.appState$.next(newState);

    return appStateItemValue;
  }

  /**
   * Exposes appState as observable, consumers can subscribe to it.
   * @date 6/8/2023 - 3:58:52 PM
   *
   * @public
   * @readonly
   * @type {Observable<AppState>}
   */
  public get appState(): Observable<AppState> {
    return this.appState$.asObservable();
  }

  /**
   * Serves Main navigation categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getMainNavCategories(): Promise<Array<Category>> {
    const categories = (await this.getAppStateItemValue(
      APP_STATE_KEYS.mainNavCategories
    ).catch(this.catchFn)) as Array<Category>;

    return categories;
  }

  /**
   * Serves Footer navigation categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getFooterNavCategories(): Promise<Array<Category>> {
    const categories = (await this.getAppStateItemValue(
      APP_STATE_KEYS.footerNavCategories
    ).catch(this.catchFn)) as Array<Category>;

    return categories;
  }

  /**
   * Serves isFeature=true categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getFeaturedCategories(): Promise<Array<Category>> {
    const categories = (await this.getAppStateItemValue(
      APP_STATE_KEYS.featuredCategories
    ).catch(this.catchFn)) as Array<Category>;

    return categories;
  }

  /**
   * Serves isFeature=true categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getHomeViewCategoryGroups(
    pageSize: number
  ): Promise<Array<PageCategoryGroup>> {
    const pageCategoryGroups = (await this.getAppStateItemValue(
      APP_STATE_KEYS.homeViewCategoryGroups,
      { pageSize }
    ).catch(this.catchFn)) as Array<PageCategoryGroup>;

    return pageCategoryGroups;
  }

  /**
   * Serves isFeature=true categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getCategoryViewCategoryGroup(
    categoryId: string,
    pageSize: number,
    startPage: string,
    isForward
  ): Promise<PageCategoryGroup> {
    const pageCategoryGroup = (await this.getAppStateItemValue(
      APP_STATE_KEYS.categoryViewCategoryGroup,
      { categoryId, pageSize, startPage, isForward }
    ).catch(this.catchFn)) as PageCategoryGroup;

    return pageCategoryGroup;
  }

  /**
   * Serves isFeature=true categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getArticleViewArticle(articleId: string): Promise<Article> {
    const article = (await this.getAppStateItemValue(
      APP_STATE_KEYS.articleViewArticle,
      { articleId }
    ).catch(this.catchFn)) as Article;

    return article;
  }

  /**
   * Gets the articles having prime-show in their features
   * @date 6/11/2023 - 3:53:06 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Article>}
   */
  public async getPrimeShowArticles(): Promise<Array<Article>> {
    const articles = (await this.getAppStateItemValue(
      APP_STATE_KEYS.primeShowArticles
    ).catch(this.catchFn)) as Array<Article>;

    return articles;
  }

  /**
   * Gets the articles having footer-show in their features
   * @date 6/11/2023 - 3:53:06 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Article>}
   */
  public async getFooterShowArticles(): Promise<Array<Article>> {
    const articles = (await this.getAppStateItemValue(
      APP_STATE_KEYS.footerShowArticles
    ).catch(this.catchFn)) as Array<Article>;

    return articles;
  }
}
