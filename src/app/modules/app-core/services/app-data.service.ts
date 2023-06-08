import {
  Inject,
  Injectable,
  PLATFORM_ID,
  StateKey,
  TransferState,
  makeStateKey,
} from '@angular/core';
import {
  CategoriesFirebaseHttpService,
  Category,
  CategoryFeatures,
  PageCategoryGroup,
  UtilsService,
} from '@annubiz/ng-lib';
import { AppState, StateKeys } from '../interfaces/app-core.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  private appState$: BehaviorSubject<AppState>;
  private stateKeys: StateKeys;

  constructor(
    private utils: UtilsService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string,
    private categoriesHttp: CategoriesFirebaseHttpService
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
    this.stateKeys = {
      navCategories: makeStateKey<Array<Category>>('navCategories'),
    };

    this.appState$ = new BehaviorSubject<AppState>({
      navCategories: [],
    });
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
    key: StateKey<Array<Category>>,
    data: Array<Category>
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
  private removeFromSsrState(key: StateKey<Array<Category>>): void {
    if (isPlatformBrowser(this.platformId)) {
      this.transferState.remove(key);
    }
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
   * Serves Main and footer navigation categories, either from cache | SSR | DB
   * @date 6/8/2023 - 3:57:51 PM
   *
   * @public
   * @async
   * @returns {Promise<Array<Category>>}
   */
  public async getNavCategories(): Promise<Array<Category>> {
    const stateKey = this.stateKeys.navCategories as StateKey<Array<Category>>;

    // serve it from cache, if available.
    let navCategories: Array<Category> = this.utils.deepCopy(
      this.appState$.value.navCategories
    );
    if (navCategories.length) {
      return navCategories;
    }

    // Else Serve from SSR transferState, if available and save to cache
    if (this.transferState.hasKey(stateKey)) {
      navCategories = this.transferState.get(stateKey, []) as Array<Category>;
      if (navCategories.length) {
        // Save to cache
        this.appState$.next({
          ...this.utils.deepCopy(this.appState$.value),
          navCategories: [...navCategories],
        });
        // Remove from SSR
        this.removeFromSsrState(stateKey);
        return navCategories;
      }
    }

    // Else Serve from DB, and save to cache & SSR transferState
    const navFeatures = [
      CategoryFeatures.primaryNavigation,
      CategoryFeatures.footerNavigation,
    ];
    navCategories = await this.categoriesHttp
      .getShallowLiveCategoriesByFeatures(navFeatures, true)
      .catch(() => []);
    // Save to cache
    this.appState$.next({
      ...this.utils.deepCopy(this.appState$.value),
      navCategories: [...navCategories],
    });
    // Save to SSR transferState
    this.saveToSsrState(stateKey, navCategories);
    return navCategories;
  }
}
