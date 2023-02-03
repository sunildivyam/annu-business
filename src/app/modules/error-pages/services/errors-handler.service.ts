import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorsHandlerService extends ErrorHandler {

  constructor(private router: Router) {
    super();
  }

  handleError(error: any) {
    let message = '';
    let code = '';
    let stack = '';

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator?.onLine) {
        // Handle offline error
        code = 'OFFLINE';
        message = 'No Internet Connection';
      } else {
        // Handle Http Error (error.status === 403, 404...)
        code = error.status.toString();
        message = error.message || error.statusText;
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      code = 'JS_ERROR';
      message = error.rejection?.message || error.message || error.toString();
      stack = error.rejection?.stack || error.stack || '';
    }

    const newError = error?.rejection ? error.rejection : error
    const navExtras: NavigationExtras = {
      relativeTo: null, // relative to root.
      skipLocationChange: false, // keeps the same url, but navigates to Error Page.
      state: { error: { code, message, stack, targetUrl: error?.target?.url || this.router.url } }  // passing error page the error details.
    }
    this.router.navigate(['error', `${(new Date()).getTime()}`], navExtras);
  }
}
