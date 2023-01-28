import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { AppConfig, MenuItem, ThemeService, SpinnerMode, CategoriesFirebaseHttpService, Category, CategoryFeatures } from '@annu/ng-lib';
import { appConfig } from './config';
import { AppSpinnerService } from './services/app-core/app-spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appConfig: AppConfig = appConfig;
  mainMenuItems: Array<MenuItem> = [];
  footerNavItems: Array<MenuItem> = [];
  isMainNavOpen: boolean = false;
  tNcUrl: string = appConfig.tNcUrl;
  privacyPolicyUrl: string = appConfig.privacyPolicyUrl;
  SpinnerMode = SpinnerMode;
  livePrimaryNavCategories: Array<Category> = [];
  HOME_VIEW_ROUTE_KEY = makeStateKey<Array<Category>>('app-route-data');

  constructor(
    private themeService: ThemeService,
    public appSpinner: AppSpinnerService,
    private categoriesHttp: CategoriesFirebaseHttpService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId) {

    if (this.transferState.hasKey(this.HOME_VIEW_ROUTE_KEY)) {
      this.livePrimaryNavCategories = this.transferState.get<Array<Category>>(this.HOME_VIEW_ROUTE_KEY, []);
      this.transferState.remove(this.HOME_VIEW_ROUTE_KEY);
    }
  }

  async ngOnInit(): Promise<void> {
    this.themeService.setTheme(this.appConfig.themeName, true);
    if (!this.livePrimaryNavCategories.length) {
      this.livePrimaryNavCategories = await this.getNavCategories([CategoryFeatures.primaryNavigation, CategoryFeatures.footerNavigation]);
      this.setTransferState(this.HOME_VIEW_ROUTE_KEY, this.livePrimaryNavCategories || []);
    }

    this.mainMenuItems = this.livePrimaryNavCategories?.length && this.getPrimaryNavItems(this.livePrimaryNavCategories) || [...appConfig.mainMenuItems];
    this.footerNavItems = this.livePrimaryNavCategories?.length && this.getFooterNavItems(this.livePrimaryNavCategories) || [...appConfig.mainMenuItems];
  }

  private async getNavCategories(features: Array<CategoryFeatures>): Promise<Array<Category>> {
     return this.categoriesHttp.getShallowLiveCategoriesByFeatures(features, true)
        .catch(() => null);
  }

  private setTransferState(key: StateKey<Array<Category>>, routeData: Array<Category>): void {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(key, routeData);
    }
  }

  private getPrimaryNavItems(categories: Array<Category>): Array<MenuItem> {
    return categories?.filter(cat => cat?.features?.includes(CategoryFeatures.primaryNavigation)).map((cat: Category) => ({
      href: ['./', cat.id],
      title: cat.shortTitle,
    } as MenuItem));
  }

  private getFooterNavItems(categories: Array<Category>): Array<MenuItem> {
    return categories?.filter(cat => cat?.features?.includes(CategoryFeatures.footerNavigation)).map((cat: Category) => ({
      href: ['./', cat.id],
      title: cat.shortTitle,
    } as MenuItem));
  }

  public loginStatusClicked(): void {
    this.isMainNavOpen = !this.isMainNavOpen;
  }

  public mainMenuOpenStatusChanged(opened: boolean): void {
    this.isMainNavOpen = opened;
  }

}
