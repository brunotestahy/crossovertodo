import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { MockRouter } from '../mocks.tests';
import { Observable } from 'rxjs/Observable';

let _http: Http = new Http(new MockBackend(), new RequestOptions);

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        LocalStorageModule.withConfig({
          prefix: 'to-do',
          storageType: 'localStorage'
        })
      ],
      providers: [
        AuthenticationService,
        { provide: Http, useValue: _http },
        LocalStorageService,
        { provide: Router, useClass: MockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should execute onSubmit method correctly with success status', fakeAsync(() => {
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    let router = fixture.debugElement.injector.get(Router);
    spyOn(authService, 'doLogin').and.returnValue(Observable.of({ status: 'success' }));
    spyOn(router, 'navigate').and.callThrough();
    spyOn(component, 'checkSuccessOrError').and.callThrough();
    component.onSubmit();
    tick(5000);
    expect(component.checkSuccessOrError).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should execute onSubmit method correctly with error status', fakeAsync(() => {
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    let router = fixture.debugElement.injector.get(Router);
    spyOn(authService, 'doLogin').and.returnValue(Observable.of({ status: 'error' }));
    spyOn(router, 'navigate').and.callThrough();
    spyOn(component, 'checkSuccessOrError').and.callThrough();
    component.onSubmit();
    tick(5000);
    expect(component.checkSuccessOrError).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should execute onSubmit method correctly with an empty status', fakeAsync(() => {
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    let router = fixture.debugElement.injector.get(Router);
    spyOn(authService, 'doLogin').and.returnValue(Observable.of({ status: '' }));
    spyOn(router, 'navigate').and.callThrough();
    spyOn(component, 'checkSuccessOrError').and.callThrough();
    component.onSubmit();
    tick(5000);
    expect(component.checkSuccessOrError).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
