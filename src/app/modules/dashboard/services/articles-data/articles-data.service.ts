import { Injectable } from '@angular/core';
import {
  Article,
  ArticlesFirebaseHttpService,
  AuthFirebaseService,
  Filter,
  FilterTypes,
  QueryConfig,
  SHALLOW_ARTICLE_FIELDS,
  StructuredQueryValueType,
} from '@annubiz/ng-lib';
import { BehaviorSubject, Observable } from 'rxjs';


/**
 * TODO:  IN PROGRESS SERVICE
 * Server side filtering of articles
 * @date 6/4/2023 - 4:36:13 AM
 *
 * @export
 * @class ArticlesDataService
 * @typedef {ArticlesDataService}
 */
@Injectable({
  providedIn: 'root',
})
export class ArticlesDataService {
  private articles$ = new BehaviorSubject<Array<Article>>([]);

  constructor(private articlesHttp: ArticlesFirebaseHttpService, private authService: AuthFirebaseService) {}

  public get articles(): Observable<Array<Article>> {
    return this.articles$.asObservable();
  }

  public refreshArticlesFromServer(filters: Array<Filter>, pageSize: number) {
    let isLive,
      isFeatured,
      isMine,
      inReview,
      features,
      categories,
      startPage;

    filters.forEach((filter: Filter) => {
      const filterValue = filter.enabled
        ? filter.type === FilterTypes.MultiSelect
          ? filter.filter.selectedValues
          : filter.filter.value
        : null;

      switch (filter.id) {
        case 'isLive':
          isLive = filterValue;
          break;
        case 'isFeatured':
          isFeatured = filterValue;
          break;
        case 'userId':
          isMine = filterValue;
          break;
        case 'inReview':
          inReview = filterValue;
          break;
        case 'features':
          features = filterValue;
          break;
          case 'categories':
            categories = filterValue;
            break;
      }
    });

    const queryConfig: QueryConfig = {
      userId: isMine === true ? this.authService.getCurrentUserId() : null,
      // id?: string | Array<string>;
      // title?: string TODO: Add to search criteria
      articleCategoryId: categories,
      orderField: 'updated',
      orderFieldType: StructuredQueryValueType.stringValue,
      isDesc: true,
      isForwardDir: true,
      startPage,
      pageSize,
      isLive,
      selectFields: SHALLOW_ARTICLE_FIELDS,
      features,
    };

    this.articlesHttp.runQueryByConfig(queryConfig)
    .then((articles: Array<Article>) => {
      const startPage = articles?.length ? articles[articles.length -1] : null;
      this.articles$.next(articles);
    });
  }
}
