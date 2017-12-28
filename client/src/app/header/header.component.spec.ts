import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthenticationService } from '../services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockRouter } from '../mocks.tests';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Observable';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let _http: Http = new Http(new MockBackend(), new RequestOptions);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'to-do',
          storageType: 'localStorage'
        })
      ],
      providers: [
        AuthenticationService,
        { provide: Http, useValue: _http },
        { provide: Router, useClass: MockRouter },
        LocalStorageService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should do logout correctly and clear the user data', fakeAsync(() => {
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    let router = fixture.debugElement.injector.get(Router);
    spyOn(authService, 'doLogout').and.returnValue(Observable.of({}));
    spyOn(authService, 'clearUserData').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    component.doLogout();
    tick(5000);
    expect(router.navigate).toHaveBeenCalled();
    expect(authService.clearUserData).toHaveBeenCalled();
  }));

  it('should do logout give an error', fakeAsync(() => {
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    let router = fixture.debugElement.injector.get(Router);
    spyOn(authService, 'doLogout').and.returnValue(Observable.throw({ error: 'Error' }));
    spyOn(router, 'navigate').and.callThrough();
    component.doLogout();
    tick(5000);
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
