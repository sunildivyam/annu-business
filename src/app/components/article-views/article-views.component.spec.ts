import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleViewsComponent } from './article-views.component';

describe('ArticleViewsComponent', () => {
  let component: ArticleViewsComponent;
  let fixture: ComponentFixture<ArticleViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleViewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
