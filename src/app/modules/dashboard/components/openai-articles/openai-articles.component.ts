import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AppConfig, MetaService } from '@annubiz/ng-lib';
const { appConfig } = environment;
const openaiArticlesMetaInfo =
  environment.dashboardConfig.openaiArticlesMetaInfo;

@Component({
  selector: 'app-openai-articles',
  templateUrl: './openai-articles.component.html',
  styleUrls: ['./openai-articles.component.scss'],
})
export class OpenaiArticlesComponent {
  loading: boolean = true;
  error: any;
  routeStartEvent: Subscription;
  routeEndEvent: Subscription;
  appConfig: AppConfig = appConfig;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService
  ) {
    this.routeStartEvent = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationStart))
      .subscribe(() => {
        this.loading = true;
        this.error = null;
      });

    this.routeEndEvent = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe(() => {
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({
      ...openaiArticlesMetaInfo,
      title: `${appConfig.metaInfo.title} - ${openaiArticlesMetaInfo.title}`,
    });
  }

  ngOnDestroy(): void {
    this.routeEndEvent.unsubscribe();
  }
}
