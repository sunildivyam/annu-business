import { Component, OnInit } from '@angular/core';
import { AppConfig, MenuItem, ThemeService, SpinnerMode } from '@annu/ng-lib';
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

  constructor(private themeService: ThemeService, public appSpinner: AppSpinnerService) {
    this.mainMenuItems = [...appConfig.mainMenuItems];
    this.footerNavItems = [...appConfig.mainMenuItems];
  }

  ngOnInit(): void {
    this.themeService.setTheme(this.appConfig.themeName, true);
  }


  public loginStatusClicked(): void {
    this.isMainNavOpen = !this.isMainNavOpen;
  }

  public mainMenuOpenStatusChanged(opened: boolean): void {
    this.isMainNavOpen = opened;
  }

}
