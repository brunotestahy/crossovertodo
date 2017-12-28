import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Status } from '../to-do-page/to-do.model';

@Injectable()
export class ToDoService {
  apiURL: string = 'http://localhost:3000/';

  constructor(private http: Http,
              private localStorage: LocalStorageService) {
  }

  // Get the todos
  public getTodos(): Observable<any> {
    let sessionId = this.localStorage.get('sessionId');
    return this.http.get(this.apiURL + 'todos?sessionId=' + sessionId, {})
      .map((response: Response) => response.json());
  }

  // Add a new to-do
  public addTodo(title: string, description: string, status: Status): Observable<any> {
    let sessionId = this.localStorage.get('sessionId');
    const body = JSON.stringify({
      title: title,
      description: description,
      status: Status[status] });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.apiURL + 'todo?sessionId=' + sessionId, body, { headers: headers })
      .map((response: Response) => response.json());
  }

  // Edit the to-do
  public editTodo(id: string,
                  title: string,
                  description: string,
                  status: Status): Observable<any> {
    let sessionId = this.localStorage.get('sessionId');
    const body = JSON.stringify({
      id: id,
      title: title,
      description: description,
      status: Status[status] });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.apiURL + 'todo?sessionId=' + sessionId, body, { headers: headers })
      .map((response: Response) => response.json());
  }

  // Delete the to-do
  public deleteTodo(id: string): Observable<any> {
    let sessionId = this.localStorage.get('sessionId');
    const body = JSON.stringify({ id: id });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers,
      body : body
    });
    return this.http.delete(this.apiURL + 'todo?sessionId=' + sessionId, options)
      .map((response: Response) => response.json());
  }
}
