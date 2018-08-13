import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReactionPanelObjectiveComponent } from './app-reaction-panel-objective.component';

describe('AppReactionPanelObjectiveComponent', () => {
  let component: AppReactionPanelObjectiveComponent;
  let fixture: ComponentFixture<AppReactionPanelObjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReactionPanelObjectiveComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReactionPanelObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
