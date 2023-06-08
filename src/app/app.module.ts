import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  AppConfigModule,
  FooterNavModule,
  LoginStatusModule,
  MenuModule,
  RouteGuardsModule,
  FirestoreInterceptor,
  ApiInterceptor,
  SpinnerModule,
  ThemeFontResizerModule,
} from '@annu/ng-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ArticleViewsModule } from './modules/article-views/article-views.module';
import { AppCoreModule } from './modules/app-core/app-core.module';
import { ErrorPagesModule } from './modules/error-pages/error-pages.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appInit } from './modules/app-core/factories/app-init.factory';
import { AppDataService } from './modules/app-core/services/app-data.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,

    // annu-ng-lib - components modules
    AppConfigModule.forRoot(environment.libConfig),
    RouteGuardsModule,
    MenuModule,
    FooterNavModule,
    LoginStatusModule,
    SpinnerModule,
    ThemeFontResizerModule,
    DashboardModule,
    ArticleViewsModule,
    AppRoutingModule,
    AppCoreModule,
    ErrorPagesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FirestoreInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppDataService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
