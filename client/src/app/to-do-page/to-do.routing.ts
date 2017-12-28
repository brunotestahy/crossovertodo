import { Routes, RouterModule } from '@angular/router';
import { ToDoPageComponent } from './to-do-page.component';

const TODO_ROUTE: Routes = [
  { path: '', component: ToDoPageComponent }
];

export const todoRouting = RouterModule.forChild(TODO_ROUTE);
