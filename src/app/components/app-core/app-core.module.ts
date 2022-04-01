import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login';
import { PrivacyPolicyComponent } from './privacy-policy';
import { TncComponent } from './tnc';
import { ContactUsComponent } from './contact-us';
import { CardModule, ErrorModule, LoginModule, LoginStatusModule, SpinnerModule } from '@annu/ng-lib';



@NgModule({
  declarations: [LoginComponent, ContactUsComponent, PrivacyPolicyComponent, TncComponent],
  imports: [
    CommonModule,
    CardModule,
    ErrorModule,
    LoginModule,
    LoginStatusModule,
    SpinnerModule,
  ],
  exports: [LoginComponent, ContactUsComponent, PrivacyPolicyComponent, TncComponent],
})
export class AppCoreModule { }
