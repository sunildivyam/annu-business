import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleViewsHomeComponent } from './article-views-home.component';

describe('ArticleViewsHomeComponent', () => {
  let component: ArticleViewsHomeComponent;
  let fixture: ComponentFixture<ArticleViewsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleViewsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleViewsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
