import { NgModule, OnDestroy } from '@angular/core';
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
export class AppRoutingModule implements OnDestroy {
  navStartSubscription: Subscription;
  navEndSubscription: Subscription;
  navErrorSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private appSpinner: AppSpinnerService) {
    // Nav Start
    this.navStartSubscription = this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.appSpinner.start();
    });


    // Nav End
    this.navEndSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.appSpinner.stop();
    });

    // Nav Error
    this.navErrorSubscription = this.router.events.pipe(filter(event => event instanceof NavigationError)).subscribe((navErrorEvent) => {
      this.appSpinner.stop();
    });
  }

  ngOnDestroy(): void {
    this.navEndSubscription && this.navEndSubscription.unsubscribe();
    this.navErrorSubscription && this.navErrorSubscription.unsubscribe();
    this.navStartSubscription && this.navStartSubscription.unsubscribe();
  }
}
