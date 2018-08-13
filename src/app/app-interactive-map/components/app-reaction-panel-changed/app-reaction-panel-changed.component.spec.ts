import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReactionPanelChangedComponent } from './app-reaction-panel-changed.component';

describe('AppReactionPanelChangedComponent', () => {
  let component: AppReactionPanelChangedComponent;
  let fixture: ComponentFixture<AppReactionPanelChangedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReactionPanelChangedComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReactionPanelChangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
