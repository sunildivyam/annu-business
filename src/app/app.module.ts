import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { AnnuNgLibModule } from '@annu/ng-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { TncComponent } from './components/tnc/tnc.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { ArticleViewsModule } from './components/article-views/article-views.module';

@NgModule({
  declarations: [
    AppComponent,
    ContactUsComponent,
    HomeComponent,
    LoginComponent,
    MyProfileComponent,
    TncComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,   // Needed to access transfered state on browser from SSR.
    // annu-ng-lib - components modules
    AnnuNgLibModule.forRoot(environment.libConfig),
    DashboardModule,
    ArticleViewsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
