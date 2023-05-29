import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiArticlesComponent } from './openai-articles.component';

describe('OpenaiArticlesComponent', () => {
  let component: OpenaiArticlesComponent;
  let fixture: ComponentFixture<OpenaiArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenaiArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenaiArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
