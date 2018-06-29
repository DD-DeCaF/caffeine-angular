import {LoginDialogComponent} from './login-dialog.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from '../app-material.module';
import {reducers} from '../store/app.reducers';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {SessionService} from '../session/session.service';
import {MatDialogRef} from '@angular/material';
import {ActivatedRoute, Params} from '@angular/router';

describe('Component: Login', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot(reducers),
      ],
      providers: [
        SessionService,
        HttpClient,
        HttpHandler,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: (value: Params) => void) => fn({
                param: 0,
              }),
            },
          },
        },
      ],
      declarations: [LoginDialogComponent],

    });
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('form invalid if is empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('email field validation', () => {
    const email = component.loginForm.controls['email'];
    expect(email.valid).toBeFalsy();
  });

  it('email field validity', () => {
    const email = component.loginForm.controls['email'];
    const errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('submitting a loginForm', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('pass4test');
    expect(component.loginForm.valid).toBeTruthy();

    component.submit();

   // check here if the user is authenticated or not
  });

});
