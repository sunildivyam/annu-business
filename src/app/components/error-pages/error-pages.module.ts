import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ErrorModule } from '@annu/ng-lib';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ErrorModule,
  ],
  exports: [UnauthorizedComponent]
})
export class ErrorPagesModule { }
