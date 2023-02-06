import { TestBed } from '@angular/core/testing';

import { ArticlesHomeViewRouteResolver } from './articles-home-view-route.resolver';

describe('ArticlesHomeViewRouteResolver', () => {
  let resolver: ArticlesHomeViewRouteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ArticlesHomeViewRouteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
