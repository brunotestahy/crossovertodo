import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToDoPageComponent } from './to-do-page.component';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { ToDoService } from '../services/to-do.service';
import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { Status } from './to-do.model';

let _http: Http = new Http(new MockBackend(), new RequestOptions);

describe('ToDoPageComponent', () => {
  let component: ToDoPageComponent;
  let fixture: ComponentFixture<ToDoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToDoPageComponent],
      imports: [
        FormsModule,
        LocalStorageModule.withConfig({
          prefix: 'to-do',
          storageType: 'localStorage'
        })
      ],
      providers: [
        ToDoService,
        { provide: Http, useValue: _http },
        LocalStorageService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent default event during allowDrop execution', () => {
    let event = new Event('drag');
    spyOn(event, 'preventDefault').and.callThrough();
    component.allowDrop(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should fill the variables during onDrag execution', () => {
    let event = 'event';
    let todo = { name: 'Todo' };
    component.draggableElement = null;
    component.selectedTodo = null;
    component.onDrag(event, todo);
    expect(component.draggableElement).not.toBeNull();
    expect(component.selectedTodo).not.toBeNull();
  });

  it('should call onDrop with a success status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    component.selectedTodo = {
      id: '1234',
      title: 'Todo',
      description: 'todo',
      status: Status.completed,
      isEditable: false
    };
    spyOn(todoService, 'editTodo').and.returnValue(Observable.of({ status: 'success' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.onDrop();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('success', 'Item completed successfully!');
  }));

  it('should call onDrop with an error status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    component.selectedTodo = {
      id: '1234',
      title: 'Todo',
      description: 'todo',
      status: Status.completed,
      isEditable: false
    };
    spyOn(todoService, 'editTodo').and.returnValue(Observable.of({ status: 'error', data: 'Error' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.onDrop();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Error!');
  }));

  it('should call onDrop with an empty status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    component.selectedTodo = {
      id: '1234',
      title: 'Todo',
      description: 'todo',
      status: Status.completed,
      isEditable: false
    };
    spyOn(todoService, 'editTodo').and.returnValue(Observable.of({ status: '' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.onDrop();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Something was wrong!');
  }));

  it('should call obtainAllTodos with a success status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    spyOn(todoService, 'getTodos').and.returnValue(Observable.of({
      status: 'success',
      data: 'data' }));
    spyOn(component, 'fillEveryTodoBucket').and.callFake(() => {});
    component.obtainAllTodos();
    tick(5000);
    expect(component.fillEveryTodoBucket).toHaveBeenCalledWith('data');
  }));

  it('should call obtainAllTodos with an error status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    spyOn(todoService, 'getTodos').and.returnValue(Observable.of({
      status: 'error',
      data: 'Error' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.obtainAllTodos();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Error!');
  }));

  it('should call obtainAllTodos with an empty status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    spyOn(todoService, 'getTodos').and.returnValue(Observable.of({ status: '' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.obtainAllTodos();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Something was wrong!');
  }));

  it('should call fillEveryTodoBucket with a completed Status', () => {
    let todos = [
      {
        title: 'Title',
        description: 'Description',
        status: Status[Status.completed],
        _id: '1234',
        author: {}
      }
    ];
    component.droppedItems = [];
    component.fillEveryTodoBucket(todos);
    expect(component.droppedItems.length).toBe(1);
  });

  it('should call fillEveryTodoBucket with a notCompleted Status', () => {
    let todos = [
      {
        title: 'Title',
        description: 'Description',
        status: Status[Status.notCompleted],
        _id: '1234',
        author: {}
      }
    ];
    component.todos = [];
    component.fillEveryTodoBucket(todos);
    expect(component.todos.length).toBe(1);
  });

  it('should call addNewTodo with a success status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let localStorage = fixture.debugElement.injector.get(LocalStorageService);
    localStorage.set('username', 'ali');
    spyOn(todoService, 'addTodo').and.returnValue(Observable.of({
      status: 'success',
      data: { _id: '1234' } }));
    spyOn(component, 'startPanel').and.callThrough();
    component.addNewTodo();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('success', 'Item added successfully!');
  }));

  it('should call addNewTodo with an error status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    spyOn(todoService, 'addTodo').and.returnValue(Observable.of({
      status: 'error',
      data: 'Error' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.addNewTodo();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Error!');
  }));

  it('should call addNewTodo with an empty status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    spyOn(todoService, 'addTodo').and.returnValue(Observable.of({ status: '' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.addNewTodo();
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Something was wrong!');
  }));

  it('should call onEditorClick successfully', () => {
    component.todos = [
      {
        title: 'Todo1',
        description: 'todo1',
        status: Status.completed,
        isEditable: false
      },
      {
        title: 'Todo1',
        description: 'todo1',
        status: Status.completed,
        isEditable: true
      }
    ];
    component.onEditorClick(component.todos[0], 0);
    expect(component.todos[0].isEditable).toBeTruthy();
  });

  it('should call editTodo with a success status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    spyOn(todoService, 'editTodo').and.returnValue(Observable.of({
      status: 'success'
    }));
    spyOn(component, 'startPanel').and.callThrough();
    component.editTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('success', 'Item updated successfully!');
  }));

  it('should call editTodo with an error status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    spyOn(todoService, 'editTodo').and.returnValue(Observable.of({
      status: 'error',
      data: 'Error' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.editTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Error!');
  }));

  it('should call editTodo with an empty status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    spyOn(todoService, 'editTodo').and.returnValue(Observable.of({ status: '' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.editTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Something was wrong!');
  }));

  it('should call deleteTodo with a success status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      id: '1234',
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    this.todos = [ todo ];
    spyOn(todoService, 'deleteTodo').and.returnValue(Observable.of({
      status: 'success'
    }));
    spyOn(component, 'startPanel').and.callThrough();
    component.deleteTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('success', 'Item deleted successfully!');
  }));

  it('should call deleteTodo with an error status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      id: '1234',
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    this.todos = [ todo ];
    spyOn(todoService, 'deleteTodo').and.returnValue(Observable.of({
      status: 'error',
      data: 'Error' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.deleteTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Error!');
  }));

  it('should call deleteTodo with an empty status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      id: '1234',
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    this.todos = [ todo ];
    spyOn(todoService, 'deleteTodo').and.returnValue(Observable.of({ status: '' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.deleteTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Something was wrong!');
  }));

  it('should call deleteCompletedTodo() with a success status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      id: '1234',
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    this.droppedItems = [ todo ];
    spyOn(todoService, 'deleteTodo').and.returnValue(Observable.of({
      status: 'success'
    }));
    spyOn(component, 'startPanel').and.callThrough();
    component.deleteCompletedTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('success', 'Item deleted successfully!');
  }));

  it('should call deleteCompletedTodo() with an error status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      id: '1234',
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    this.droppedItems = [ todo ];
    spyOn(todoService, 'deleteTodo').and.returnValue(Observable.of({
      status: 'error',
      data: 'Error' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.deleteCompletedTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Error!');
  }));

  it('should call deleteCompletedTodo() with an empty status response', fakeAsync(() => {
    let todoService = fixture.debugElement.injector.get(ToDoService);
    let todo = {
      id: '1234',
      title: 'Todo1',
      description: 'todo1',
      status: Status.completed,
      isEditable: false
    };
    this.droppedItems = [ todo ];
    spyOn(todoService, 'deleteTodo').and.returnValue(Observable.of({ status: '' }));
    spyOn(component, 'startPanel').and.callThrough();
    component.deleteCompletedTodo(todo);
    tick(5000);
    expect(component.startPanel).toHaveBeenCalledWith('danger', 'Something was wrong!');
  }));
});
