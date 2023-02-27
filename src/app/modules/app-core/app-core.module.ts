import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login';
import { ContactUsComponent } from './components/contact-us';
import { CardModule, ErrorModule, LoginModule, LoginStatusModule, SitemapModule, SpinnerModule } from '@annu/ng-lib';
import { SitemapComponent } from './components/sitemap/sitemap.component';



@NgModule({
  declarations: [LoginComponent, ContactUsComponent, SitemapComponent],
  imports: [
    CommonModule,
    CardModule,
    ErrorModule,
    LoginModule,
    LoginStatusModule,
    SpinnerModule,
    SitemapModule,
  ],
  exports: [LoginComponent, ContactUsComponent, SitemapComponent],
})
export class AppCoreModule { }
