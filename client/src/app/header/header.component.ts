import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() showLogoutButton: boolean;

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  // Verify login state to show or not the logout link
  ngOnInit() {
    this.authService.isLoggedEvent
      .subscribe((isLogged) => {
        this.showLogoutButton = isLogged;
      });
  }

  // Make the logout
  public doLogout(): void {
    let session = this.authService.getSessioId();
    this.authService.doLogout(session)
      .subscribe(
        () => {
          this.router.navigate(['']);
        },
        error => {
          console.error('Error during the logout => ', error);
        },
        () => {
          // Complete method from Observable
          this.authService.clearUserData();
        });
  }

}
