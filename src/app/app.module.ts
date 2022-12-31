import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppConfigModule, FooterNavModule, LoginStatusModule, MenuModule } from '@annu/ng-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { ArticleViewsModule } from './components/article-views/article-views.module';
import { AppCoreModule } from './components/app-core/app-core.module';
import { ErrorPagesModule } from './components/error-pages/error-pages.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),

    // annu-ng-lib - components modules
    AppConfigModule.forRoot(environment.libConfig),
    MenuModule,
    FooterNavModule,
    LoginStatusModule,

    DashboardModule,
    ArticleViewsModule,
    AppRoutingModule,
    AppCoreModule,
    ErrorPagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
