import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Rx';

let _http: Http = new Http(new MockBackend(), new RequestOptions);

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: Http, useValue: _http },
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

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  it('should make doLogin successfully', inject([AuthenticationService], (service: AuthenticationService) => {
    spyOn(_http, 'post').and.returnValue(Observable.of({
      json: () => {
        return { logged: true }
      }
    }));
    service.doLogin({ username: 'ali' })
      .subscribe((result) => {
        expect(result.logged).toBeTruthy();
      });
  }));

  it('should make doLogout successfully', inject([AuthenticationService], (service: AuthenticationService) => {
    spyOn(_http, 'get').and.returnValue(Observable.of({
      json: () => {
        return { logged: false }
      }
    }));
    service.doLogout({ sessionId: 'ali' })
      .subscribe((result) => {
        expect(result.logged).toBeFalsy();
      });
  }));

  it('should save user data and get sessionId correctly', inject([AuthenticationService, LocalStorageService], (service: AuthenticationService, localStorage: LocalStorageService) => {
    spyOn(localStorage, 'get').and.callThrough();
    spyOn(localStorage, 'set').and.callThrough();
    service.saveUserData({ username: 'ali', sessionId: 'ali' });
    expect(localStorage.set).toHaveBeenCalledWith('username', 'ali');
    expect(localStorage.set).toHaveBeenCalledWith('sessionId', 'ali');
    service.getSessioId();
    expect(localStorage.get).toHaveBeenCalledWith('sessionId');
  }));

  it('should clearUserData correctly', inject([AuthenticationService, LocalStorageService], (service: AuthenticationService, localStorage: LocalStorageService) => {
    spyOn(localStorage, 'clearAll').and.callThrough();
    service.clearUserData();
    expect(localStorage.clearAll).toHaveBeenCalled();
  }));
});
