import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { routes as allRoutes } from './app.routes';
import { AppSpinnerService } from './services/app-core/app-spinner.service';

const routes: Routes = allRoutes;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking'}),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
  navStartSubscription: Subscription;
  navEndSubscription: Subscription;
  navErrorSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private appSpinner: AppSpinnerService) {
    // Nav Start
    this.navStartSubscription = this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.appSpinner.start();
    });


    // Nav End
    this.navStartSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.appSpinner.stop();
    });

    // Nav Error
    this.navStartSubscription = this.router.events.pipe(filter(event => event instanceof NavigationError)).subscribe(() => {
      this.appSpinner.stop();
      // Also handle Route Navigation here, may be navigate to Error Page.
    });
  }
}
