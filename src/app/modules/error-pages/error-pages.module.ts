import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { CollapsibleModule, ErrorModule } from '@annubiz/ng-lib';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { ErrorsHandlerService } from './services/errors-handler.service';

@NgModule({
  declarations: [UnauthorizedComponent, ErrorComponent],
  imports: [CommonModule, RouterModule, ErrorModule, CollapsibleModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandlerService,
    },
  ],
  exports: [UnauthorizedComponent, ErrorComponent],
})
export class ErrorPagesModule {}
