import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';



@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [UnauthorizedComponent]
})
export class ErrorPagesModule { }
