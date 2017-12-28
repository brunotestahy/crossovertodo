import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PanelComponent } from './panel/panel.component';
import { HeaderComponent } from './header/header.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { routing } from './app.routing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    HeaderComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    routing,
    LocalStorageModule.withConfig({
      prefix: 'to-do',
      storageType: 'localStorage'
    })
  ],
  providers: [AuthGuard, AuthenticationService, LocalStorageModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
