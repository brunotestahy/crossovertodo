import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Status, ToDoModel } from './to-do.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToDoService } from '../services/to-do.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-to-do-page',
  templateUrl: './to-do-page.component.html',
  styleUrls: ['./to-do-page.component.scss'],
  animations: [
    trigger(
      'fadeTransition', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('200ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class ToDoPageComponent implements OnInit {

  todos: Array<ToDoModel> = [];
  selectedTodo: ToDoModel;
  droppedItems: Array<ToDoModel> = [];
  draggableElement: ElementRef;
  @ViewChild('droppableElement') droppableElement: ElementRef;

  showPanel = false;
  messagePanel = '';
  typePanel = 'danger';

  constructor(private todoService: ToDoService,
              private localStorage: LocalStorageService) {
  }

  // Load all todos on page loading
  ngOnInit() {
    this.obtainAllTodos();
  }

  // The droppable item permits the drop
  public allowDrop(event: Event): void {
    event.preventDefault();
  }

  // Capture the item dragged
  public onDrag(event: any, currentTodo): void {
    this.draggableElement = event;
    this.selectedTodo = currentTodo;
  }

  // Change the to-do status when dropped
  public onDrop(): void {
    const index = this.todos.indexOf(this.selectedTodo);
    const completedStatus = Status.completed;
    this.todoService.editTodo(this.selectedTodo.id, this.selectedTodo.title, this.selectedTodo.description, completedStatus)
      .subscribe((result) => {
        console.log(result);
        if (result.status === 'success') {
          this.droppedItems.push(this.selectedTodo);
          this.todos.splice(index, 1);
          this.startPanel('success', 'Item completed successfully!');
        } else if (result.status === 'error') {
          this.startPanel('danger', result.data + '!');
        } else {
          this.startPanel('danger', 'Something was wrong!');
        }
      });
  }

  // Load all todos calling the service
  public obtainAllTodos(): void {
    this.todoService.getTodos()
      .subscribe((result) => {
        if (result.status === 'success') {
          this.fillEveryTodoBucket(result.data);
        } else if (result.status === 'error') {
          this.startPanel('danger', result.data + '!');
        } else {
          this.startPanel('danger', 'Something was wrong!');
        }
      });
  }

  // Format all the fields in the to-do correctly
  public fillEveryTodoBucket(todos: Array<any>): void {
    for (let todo of todos) {
      todo.description = todo.description.replace('<p>', '');
      todo.description = todo.description.replace('</p>', '');

      let todoInstance: ToDoModel = new ToDoModel(
        todo.title,
        todo.description,
        todo.status,
        false,
        todo._id,
        todo.author);

      if (todoInstance.status.toString() === Status[Status.notCompleted]) {
        this.todos.push(todoInstance);
      }
      if (todoInstance.status.toString() === Status[Status.completed]) {
        this.droppedItems.push(todoInstance);
      }
    }
  }

  // Add a new to-do calling the service
  public addNewTodo(): void {
    let username = this.localStorage.get('username').toString();
    let newTodo: ToDoModel = new ToDoModel('Type a title',
      'Type a description',
      Status.notCompleted,
      false,
      '',
      { id: '', username: username });

    this.todoService.addTodo(newTodo.title, newTodo.description, newTodo.status)
      .subscribe((result) => {
        if (result.status === 'success') {
          newTodo.id = result.data._id;
          this.todos.push(newTodo);
          this.startPanel('success', 'Item added successfully!');
        } else if (result.status === 'error') {
          this.startPanel('danger', result.data + '!');
        } else {
          this.startPanel('danger', 'Something was wrong!');
        }
      });

  }

  // Change the to-do state to editable or not
  public onEditorClick(todo: ToDoModel, index: number): void {
    for (let item in this.todos) {
      this.todos[item].isEditable = false;
      if (item === index.toString()) {
        todo.isEditable = true;
      }
    }
  }

  // Update the to-do calling the service
  public editTodo(todo: ToDoModel): void {
    this.todoService.editTodo(todo.id,
      todo.title,
      todo.description,
      todo.status[todo.status])
      .subscribe((result) => {
        if (result.status === 'success') {
          todo.isEditable = false;
          this.startPanel('success', 'Item updated successfully!');
        } else if (result.status === 'error') {
          this.startPanel('danger', result.data + '!');
        } else {
          this.startPanel('danger', 'Something was wrong!');
        }
      });
  }

  // Delete the to-do in progress calling the service
  public deleteTodo(todo: ToDoModel): void {
    const index = this.todos.indexOf(todo);
    this.todoService.deleteTodo(todo.id)
      .subscribe((result) => {
        if (result.status === 'success') {
          this.todos.splice(index, 1);
          this.startPanel('success', 'Item deleted successfully!');
        } else if (result.status === 'error') {
          this.startPanel('danger', result.data + '!');
        } else {
          this.startPanel('danger', 'Something was wrong!');
        }
      });

  }

  // Delete the completed to-do calling the service
  public deleteCompletedTodo(item: ToDoModel): void {
    const index = this.droppedItems.indexOf(item);
    this.todoService.deleteTodo(item.id)
      .subscribe((result) => {
        if (result.status === 'success') {
          this.droppedItems.splice(index, 1);
          this.startPanel('success', 'Item deleted successfully!');
        } else if (result.status === 'error') {
          this.startPanel('danger', result.data + '!');
        } else {
          this.startPanel('danger', 'Something was wrong!');
        }
      });
  }

  //Verify what Panel kind to show and maybe save the User Data
  public startPanel(panelType: string, panelMessage: string): void {
    this.typePanel = panelType;
    this.messagePanel = panelMessage;
    this.showPanel = true;
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
    this.typePanel = 'danger';
  }
}
