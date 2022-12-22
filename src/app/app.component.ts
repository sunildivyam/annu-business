import { Component, OnInit } from '@angular/core';
import { AppConfig, MenuItem, ThemeService } from '@annu/ng-lib';
import { mainRoutes } from './app.routes';
import { appConfig } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appConfig: AppConfig = appConfig;
  mainMenuItems: Array<MenuItem> = [];
  footerNavItems: Array<MenuItem> = mainRoutes.map(r => ({ title: r.data.title, href: [r.path] }));
  isMainNavOpen: boolean = false;
  tNcUrl: string = appConfig.tNcUrl;
  privacyPolicyUrl: string = appConfig.privacyPolicyUrl;

  constructor(private themeService: ThemeService) {
    this.mainMenuItems = [...appConfig.mainMenuItems];
    this.footerNavItems = [ ...this.mainMenuItems, ...mainRoutes.map(r => ({ title: r.data.title, href: [r.path] }))];
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
