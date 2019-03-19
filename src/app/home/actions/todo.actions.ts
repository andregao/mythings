import { Action } from '@ngrx/store';
import { Todo } from '../../shared/models/todo.model';

export enum TodoActionTypes {
  SyncTodos = '[Home] Sync Todos',
  ToggleTodoStatus = '[Home] Set Current Todo',
  MoveTodo = '[Home] Move Todo',
  AddTodo = '[Home] Add Todo',
  UpdateTodo = '[Home] Update Todo',
  DeleteTodo = '[Home] Delete Todo',
  ReorderTodos = '[Home] Reorder Todos',
  ClearTodos = '[Home] Clear Todos',
}

export class SyncTodos implements Action {
  readonly type = TodoActionTypes.SyncTodos;

  constructor(public payload: Todo[]) {
  }
}

export class ToggleTodoStatus implements Action {
  readonly type = TodoActionTypes.ToggleTodoStatus;

  constructor(public payload: Todo) {
  }
}

export class AddTodo implements Action {
  readonly type = TodoActionTypes.AddTodo;

  constructor(public payload: Todo) {
  }
}

export class UpdateTodo implements Action {
  readonly type = TodoActionTypes.UpdateTodo;

  constructor(public payload: Todo) {
  }
}

export class MoveTodo implements Action {
  readonly type = TodoActionTypes.MoveTodo;

  constructor(public payload: {todo: Todo, fromProject: string}) {
  }
}

export class DeleteTodo implements Action {
  readonly type = TodoActionTypes.DeleteTodo;

  constructor(public payload: Todo) {
  }
}

export class ReorderTodos implements Action {
  readonly type = TodoActionTypes.ReorderTodos;

  constructor(public payload: {todoIds: string[], projectId: string}) {
  }
}

export class ClearTodos implements Action {
  readonly type = TodoActionTypes.ClearTodos;
}

export type TodoActionsUnion =
  | SyncTodos
  | ToggleTodoStatus
  | MoveTodo
  | AddTodo
  | UpdateTodo
  | DeleteTodo
  | ReorderTodos
  | ClearTodos;
