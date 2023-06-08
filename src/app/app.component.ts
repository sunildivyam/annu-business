import { Component, OnInit } from '@angular/core';
import {
  AppConfig,
  MenuItem,
  ThemeService,
  SpinnerMode,
  Category,
  CategoryFeatures,
} from '@annu/ng-lib';
import { AppSpinnerService } from './modules/app-core/services/app-spinner.service';
import { environment } from '../environments/environment';
import { AppDataService } from './modules/app-core/services/app-data.service';
import { AppState } from './modules/app-core/interfaces/app-core.interface';
const { appConfig } = environment;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  appConfig: AppConfig = appConfig;
  mainMenuItems: Array<MenuItem> = [];
  footerNavItems: Array<MenuItem> = [];
  isMainNavOpen: boolean = false;
  SpinnerMode = SpinnerMode;
  liveNavCategories: Array<Category> = [];
  themeFontSizes: Array<string> = ['12px', '16px', '20px'];

  constructor(
    private themeService: ThemeService,
    public appSpinner: AppSpinnerService,
    private appDataService: AppDataService
  ) {
    this.appDataService.appState.subscribe((appState: AppState) =>
      this.generateNavItems(appState.navCategories)
    );
  }

  async ngOnInit(): Promise<void> {
    this.themeService.setTheme(this.appConfig.themeName, true);
  }

  private generateNavItems(categories: Array<Category>): void {
    this.mainMenuItems = [];
    this.footerNavItems = [];
    categories.forEach((cat) => {
      const isMainNavCat = cat?.features?.includes(
        CategoryFeatures.primaryNavigation
      );
      const isFooterNavCat = cat?.features?.includes(
        CategoryFeatures.footerNavigation
      );

      const menuItem = {
        href: ['./', cat?.id],
        title: cat?.shortTitle,
      } as MenuItem;

      if (isMainNavCat) this.mainMenuItems.push(menuItem);
      if (isFooterNavCat) this.footerNavItems.push(menuItem);
    });
  }

  public loginStatusClicked(): void {
    this.isMainNavOpen = !this.isMainNavOpen;
  }

  public mainMenuOpenStatusChanged(opened: boolean): void {
    this.isMainNavOpen = opened;
  }
}
