import { TestBed } from '@angular/core/testing';

import { ArticleViewRouteResolver } from './article-view-route.resolver';

describe('ArticleViewRouteResolver', () => {
  let resolver: ArticleViewRouteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ArticleViewRouteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
