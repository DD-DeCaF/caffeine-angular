import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReactionComponent } from './app-reaction.component';

describe('AppReactionComponent', () => {
  let component: AppReactionComponent;
  let fixture: ComponentFixture<AppReactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReactionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
