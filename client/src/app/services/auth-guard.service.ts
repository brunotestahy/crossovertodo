import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService,
              private router: Router) {}

  // Return if the to-do page may be accessed or not
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.authService.isLoggedEvent
      .map((isLogged: boolean) => {
        if (!isLogged) {
          this.router.navigate(['']);
        }
        return isLogged;
      });
  }

}
