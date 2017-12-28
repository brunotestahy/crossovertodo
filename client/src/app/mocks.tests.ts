import { NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// Class Mocks for unit tests

export class MockRouter {
  navigate(route: any[], extras: NavigationExtras): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}

export class AuthGuardMock {

  isLogged: boolean = false;

  router = {
    navigate: (link: Array<string>) => {}
  };

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return Observable.of(this.isLogged)
      .map((isLogged: boolean) => {
        if (!isLogged) {
          this.router.navigate(['']);
        }
        return isLogged;
      });
  }

}
