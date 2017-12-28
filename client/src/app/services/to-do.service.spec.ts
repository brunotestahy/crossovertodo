import { TestBed, inject } from '@angular/core/testing';

import { ToDoService } from './to-do.service';
import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Rx';
import { Status } from '../to-do-page/to-do.model';

let _http: Http = new Http(new MockBackend(), new RequestOptions);

describe('ToDoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToDoService,
        { provide: Http, useValue: _http },
        LocalStorageService
      ],
      imports: [
        LocalStorageModule.withConfig({
          prefix: 'to-do',
          storageType: 'localStorage'
        })
      ]
    });
  });

  it('should be created', inject([ToDoService], (service: ToDoService) => {
    expect(service).toBeTruthy();
  }));

  it('should getTodos successfully', inject([ToDoService], (service: ToDoService) => {
    spyOn(_http, 'get').and.returnValue(Observable.of({
      json: () => {
        return { todoName: 'testing' }
      }
    }));
    service.getTodos()
      .subscribe((result) => {
        expect(result.todoName).toBe('testing');
      });
  }));

  it('should addTodo successfully', inject([ToDoService], (service: ToDoService) => {
    spyOn(_http, 'put').and.returnValue(Observable.of({
      json: () => {
        return { status: 'success' }
      }
    }));
    service.addTodo('First', 'Testing', Status.notCompleted)
      .subscribe((result) => {
        expect(result.status).toBe('success');
      });
  }));

  it('should editTodo successfully', inject([ToDoService], (service: ToDoService) => {
    spyOn(_http, 'put').and.returnValue(Observable.of({
      json: () => {
        return { status: 'success' }
      }
    }));
    service.editTodo('1234', 'First', 'Testing', Status.completed)
      .subscribe((result) => {
        expect(result.status).toBe('success');
      });
  }));

  it('should deleteTodo successfully', inject([ToDoService], (service: ToDoService) => {
    spyOn(_http, 'delete').and.returnValue(Observable.of({
      json: () => {
        return { status: 'success' }
      }
    }));
    service.deleteTodo('1234')
      .subscribe((result) => {
        expect(result.status).toBe('success');
      });
  }));
});
