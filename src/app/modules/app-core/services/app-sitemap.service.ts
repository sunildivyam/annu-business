import { Injectable } from '@angular/core';
import {
  ArticlesFirebaseHttpService,
  CategoriesFirebaseHttpService,
  SitemapInfo,
  SitemapItem,
  Article,
  LibConfig,

} from '@annubiz/ng-lib';

@Injectable({
  providedIn: 'root'
})
export class AppSitemapService {

  constructor(
    private categoriesHttp: CategoriesFirebaseHttpService,
    private articlesHttp: ArticlesFirebaseHttpService,
    private libConfig: LibConfig) { }

  public async generateCategoryUrls(sitemapInfo: SitemapInfo): Promise<Array<SitemapItem>> {
    let sitemapItems: Array<SitemapItem> = [];
    const categories = await this.categoriesHttp.getAllLiveCategoriesFromDate(sitemapInfo.updated)
      .catch(error => {
        return [];
      });
    sitemapItems = categories.map(cat => {
      return {
        loc: {
          _text: `${this.libConfig.apiBaseUrl}/${cat.id}`
        },
        lastmod: {
          _text: cat.updated
        },
        priority: {
          _text: '1.00'
        }
      } as SitemapItem;
    }) || [];

    return sitemapItems;
  }

  public async generateArticleUrls(sitemapInfo: SitemapInfo): Promise<Array<SitemapItem>> {
    let sitemapItems: Array<SitemapItem> = [];
    const articles = await this.articlesHttp.getAllLiveArticlesFromDate(sitemapInfo.updated)
      .catch(error => {
        return [];
      });
    articles.forEach((article: Article) => {
      article.categories.forEach(catId => {
        sitemapItems.push({
          loc: {
            _text: `${this.libConfig.apiBaseUrl}/${catId}/${article.id}`
          },
          lastmod: {
            _text: article.updated
          },
          priority: {
            _text: '0.80'
          }
        } as SitemapItem)
      })
    });

    return sitemapItems;
  }
}
