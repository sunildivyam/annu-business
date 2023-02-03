import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login';
import { ContactUsComponent } from './components/contact-us';
import { CardModule, ErrorModule, LoginModule, LoginStatusModule, SpinnerModule } from '@annu/ng-lib';



@NgModule({
  declarations: [LoginComponent, ContactUsComponent],
  imports: [
    CommonModule,
    CardModule,
    ErrorModule,
    LoginModule,
    LoginStatusModule,
    SpinnerModule,
  ],
  exports: [LoginComponent, ContactUsComponent],
})
export class AppCoreModule { }
