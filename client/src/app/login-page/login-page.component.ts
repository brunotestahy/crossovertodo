import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  showPanel = false;
  messagePanel = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    //Get values from the form
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: [''.toString(), Validators.required],
    });
    this.authService.isLoggedEvent.next(false);
  }

  //Send the values from the form to login
  public onSubmit(): void {
    // Encrypt the password with Md5
    this.loginForm.value.password = Md5.hashStr(this.loginForm.value.password);

    this.authService.doLogin(this.loginForm.value)
      .subscribe(
        data => {
          this.checkSuccessOrError(data);
        });
  }

  //Verify what Panel kind to show and maybe save the User Data
  public checkSuccessOrError(response): void {
    if (response.status === 'success') {
      this.authService.saveUserData(response);
      this.authService.isLoggedEvent.next(true);
      //Go to To-Do Page
      this.router.navigate(['to-do']);
    } else if (response.status === 'error') {
      this.messagePanel = response.error + '!';
      this.showPanel = true;
    } else {
      this.messagePanel = 'Something was wrong!';
      this.showPanel = true;
    }
    this.hidePanel();
  }


  // Hide the Panel after 4 seconds
  public hidePanel(): void {
    const timeToHide: number = 4000;
    setTimeout(() => {
      this.setValuesDefault();
    }, timeToHide);
  }

  // Set the Panel values to default
  public setValuesDefault(): void {
    this.showPanel = false;
    this.messagePanel = '';
  }

}
