export class ToDoModel {
  constructor(public title: string,
              public description: string,
              public status: Status,
              public isEditable: boolean,
              public id?: string,
              public author?: { id?: string, username: string }) {
  }
}

export enum Status {
  'completed',
  'notCompleted'
}
