import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReactionPanelComponent } from './app-reaction-panel.component';

describe('AppReactionPanelComponent', () => {
  let component: AppReactionPanelComponent;
  let fixture: ComponentFixture<AppReactionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReactionPanelComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReactionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
