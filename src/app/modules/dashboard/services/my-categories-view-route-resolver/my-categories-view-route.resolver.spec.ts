import { TestBed } from '@angular/core/testing';

import { MyCategoriesViewRouteResolver } from './my-categories-view-route.resolver';

describe('MyCategoriesViewRouteResolver', () => {
  let resolver: MyCategoriesViewRouteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MyCategoriesViewRouteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
