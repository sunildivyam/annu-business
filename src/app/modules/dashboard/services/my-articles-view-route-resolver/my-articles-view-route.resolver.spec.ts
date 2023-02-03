import { TestBed } from '@angular/core/testing';

import { MyArticlesViewRouteResolver } from './my-articles-view-route.resolver';

describe('MyArticlesViewRouteResolver', () => {
  let resolver: MyArticlesViewRouteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MyArticlesViewRouteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
