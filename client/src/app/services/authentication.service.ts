import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {
  apiURL: string = 'http://localhost:3000/';
  isLoggedEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: Http,
              private localStorageService: LocalStorageService) {
  }

  // Do the user Login
  public doLogin(user: any): Observable<any> {
    const body = JSON.stringify(user);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiURL + 'user/auth', body, {
      headers: headers
    })
      .map((response: Response) => response.json());
  }

  // Save User Data on LocalStorage
  public saveUserData(data): void {
    this.localStorageService.set('username', data.username);
    this.localStorageService.set('sessionId', data.sessionId);
  }

  // Clear User data from LocalStorage
  public clearUserData(): void {
    this.localStorageService.clearAll();
  }

  // Get the sessionId
  public getSessioId(): {} {
    return this.localStorageService.get('sessionId');
  }

  // Do the Logout
  public doLogout(sessionId): Observable<any> {
    return this.http.get(this.apiURL + 'user/logout?sessionId=' + sessionId, {})
      .map((response: Response) => response.json());
  }

}
