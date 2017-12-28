import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MockRouter } from '../mocks.tests';
import 'rxjs/Rx';

let _http: Http = new Http(new MockBackend(), new RequestOptions);

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Http, useValue: _http },
        AuthenticationService,
        { provide: Router, useClass: MockRouter },
        LocalStorageService
      ],
      imports: [
        LocalStorageModule.withConfig({
          prefix: 'to-do',
          storageType: 'localStorage'
        })
      ]
    });
  });

  it('should be created', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy();
  }));

  it('should navigate to login page if return false', inject([AuthenticationService, Router, AuthGuard], (authService: AuthenticationService, router: Router, provider: AuthGuard) => {
    spyOn(authService.isLoggedEvent, 'map').and
      .callFake((operation: (logged: boolean) => {} = (logged: boolean) => { return logged; }) => {
        return operation(false);
      });
    let fakeActivatedSnapshot = new ActivatedRouteSnapshot();
    let fakeStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
    spyOn(router, 'navigate').and.callThrough();
    expect(provider.canActivate(fakeActivatedSnapshot, fakeStateSnapshot)).toBeFalsy();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should return true', inject([AuthenticationService, Router, AuthGuard], (authService: AuthenticationService, router: Router, provider: AuthGuard) => {
    spyOn(authService.isLoggedEvent, 'map').and
      .callFake((operation: (logged: boolean) => {} = (logged: boolean) => { return logged; }) => {
      return operation(true);
    });
    let fakeActivatedSnapshot = new ActivatedRouteSnapshot();
    let fakeStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
    spyOn(router, 'navigate').and.callThrough();
    expect(provider.canActivate(fakeActivatedSnapshot, fakeStateSnapshot)).toBeTruthy();
  }));
});
