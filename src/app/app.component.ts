import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { AppConfig, MenuItem, ThemeService, SpinnerMode, CategoriesFirebaseHttpService, Category, CategoryFeatures } from '@annu/ng-lib';
import { AppSpinnerService } from './modules/app-core/services/app-spinner.service';
import { environment } from '../environments/environment';
const { appConfig } = environment;

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
  liveNavCategories: Array<Category> = [];
  HOME_VIEW_ROUTE_KEY = makeStateKey<Array<Category>>('app-route-data');

  constructor(
    private themeService: ThemeService,
    public appSpinner: AppSpinnerService,
    private categoriesHttp: CategoriesFirebaseHttpService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId) {

    if (this.transferState.hasKey(this.HOME_VIEW_ROUTE_KEY)) {
      this.liveNavCategories = this.transferState.get<Array<Category>>(this.HOME_VIEW_ROUTE_KEY, []);
      this.transferState.remove(this.HOME_VIEW_ROUTE_KEY);
    }
  }

  async ngOnInit(): Promise<void> {
    this.themeService.setTheme(this.appConfig.themeName, true);
    if (!this.liveNavCategories.length) {
      this.liveNavCategories = await this.getNavCategories([CategoryFeatures.primaryNavigation, CategoryFeatures.footerNavigation]);
      this.setTransferState(this.HOME_VIEW_ROUTE_KEY, this.liveNavCategories || []);
    }

    this.mainMenuItems = this.liveNavCategories?.length && this.getPrimaryNavItems(this.liveNavCategories) || [...appConfig.mainMenuItems];
    this.footerNavItems = this.liveNavCategories?.length && this.getFooterNavItems(this.liveNavCategories) || [...appConfig.mainMenuItems];
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
