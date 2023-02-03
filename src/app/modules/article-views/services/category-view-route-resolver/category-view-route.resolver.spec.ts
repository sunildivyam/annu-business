import { TestBed } from '@angular/core/testing';

import { CategoryViewRouteResolver } from './category-view-route.resolver';

describe('CategoryViewRouteResolver', () => {
  let resolver: CategoryViewRouteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CategoryViewRouteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
