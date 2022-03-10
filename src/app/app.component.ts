import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { AppConfig, ThemeService } from '@annu/ng-lib';
import { mainRoutes } from './app.routes';
import { appConfig } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appConfig: AppConfig = appConfig;
  mainRoutes: Array<Route> = mainRoutes;
  isMainNavOpen: boolean = false;

  constructor(private themeService: ThemeService) {}

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
