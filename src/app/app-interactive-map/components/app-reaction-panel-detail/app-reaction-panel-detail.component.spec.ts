import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReactionPanelDetailComponent } from './app-reaction-panel-detail.component';

describe('AppReactionPanelDetailComponent', () => {
  let component: AppReactionPanelDetailComponent;
  let fixture: ComponentFixture<AppReactionPanelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReactionPanelDetailComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReactionPanelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
