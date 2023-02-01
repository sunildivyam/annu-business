import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig, AuthFirebaseService } from '@annu/ng-lib';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
const { appConfig } = environment;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  error: any;
  loading: boolean = true;
  appConfig: AppConfig = appConfig;
  qParamsSubscription: Subscription;
  authStateSubscription: Subscription;
  returnUrl: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private authFireSvc: AuthFirebaseService) {
    this.qParamsSubscription = this.route.queryParams.subscribe(qParams => {
      this.returnUrl = qParams['returnUrl'];
    })

    this.authStateSubscription = this.authFireSvc.authStateChanged().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authFireSvc.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.qParamsSubscription.unsubscribe();
    this.authStateSubscription.unsubscribe();
  }

  public onSuccess(loginInfo: any): void {
    if (loginInfo?.user && loginInfo?.returnUrl) {
      this.router.navigate([loginInfo?.returnUrl])
    } else {
      this.router.navigate([this.returnUrl || '/']);
    }
  }

  public onError(error: any): void {
    this.error = error;
  }

  public onUiShown(): void {
    this.loading = false;
  }
}
