import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sitemap, SitemapService, SitemapResponse, SitemapInfo, SitemapItem } from '@annubiz/ng-lib';
import { AppSitemapService } from '../../services/app-sitemap.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent {
  sitemapInfo: SitemapInfo = null;
  sitemap: Sitemap = null;
  newSitemap: Sitemap = null;
  newUrls: Array<SitemapItem> = [];

  constructor(
    private appSitemapSvc: AppSitemapService,
    private sitemapSvc: SitemapService) {

  }

  public loadSitemap(): void {
    this.sitemapSvc.getSitemapResponse().then((sitemapRes: SitemapResponse) => {
      this.sitemapInfo = sitemapRes.sitemapInfo;
      this.sitemap = sitemapRes.sitemap;
    });
  }

  public checkNewUrls(): void {
    Promise.all([
      this.appSitemapSvc.generateCategoryUrls(this.sitemapInfo),
      this.appSitemapSvc.generateArticleUrls(this.sitemapInfo)
    ])
      .then(([catSitemapItems, artSitemapItems]) => {
        this.newUrls = [...catSitemapItems, ...artSitemapItems];
      });
  }

  public previewSitemap(): void {
    this.newSitemap = this.sitemapSvc.addUrlsToSitemapJson(this.newUrls, this.sitemap);
  }

  public saveSitemap(sitemap: Sitemap): void {
    console.log(this.sitemapSvc.jsonToXmlSitemap(sitemap));
  }
}
