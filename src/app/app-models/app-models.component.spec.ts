import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModelsComponent } from './app-models.component';

describe('AppModelsComponent', () => {
  let component: AppModelsComponent;
  let fixture: ComponentFixture<AppModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppModelsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
