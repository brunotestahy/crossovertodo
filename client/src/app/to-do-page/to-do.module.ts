import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { todoRouting } from './to-do.routing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ToDoService } from '../services/to-do.service';
import { ToDoPageComponent } from './to-do-page.component';
import { FormsModule } from '@angular/forms';

//Here is the module of Lazy Loading
@NgModule({
  imports: [
    todoRouting,
    HttpModule,
    CommonModule,
    FormsModule,
    LocalStorageModule.withConfig({
      prefix: 'to-do',
      storageType: 'localStorage'
    })
  ],
  declarations: [
    ToDoPageComponent
  ],
  providers: [
    ToDoService,
    LocalStorageModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToDoModule {
}
