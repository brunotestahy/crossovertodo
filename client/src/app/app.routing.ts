import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './services/auth-guard.service';

const APP_ROUTES: Routes = [
  { path: '', component: LoginPageComponent, pathMatch: 'full' },
  //Lazy Loading here
  { path: 'to-do', loadChildren: 'app/to-do-page/to-do.module#ToDoModule', canActivate: [AuthGuard] },
  // In case of a unknown path, redirect to Login
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
