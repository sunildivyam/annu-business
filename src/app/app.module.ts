import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppConfigModule, FooterNavModule, LoginStatusModule, MenuModule, RouteGuardsModule, FirestoreInterceptor } from '@annu/ng-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { ArticleViewsModule } from './components/article-views/article-views.module';
import { AppCoreModule } from './components/app-core/app-core.module';
import { ErrorPagesModule } from './components/error-pages/error-pages.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,

    // annu-ng-lib - components modules
    AppConfigModule.forRoot(environment.libConfig),
    RouteGuardsModule,
    MenuModule,
    FooterNavModule,
    LoginStatusModule,

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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
