import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TodoActions } from '../actions';
import { DataService } from '../../core/data.service';
import { concatMap, exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { Todo } from '../../shared/models/todo.model';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions<TodoActions.TodoActionsUnion>,
    private dataService: DataService,
  ) {
  }

  @Effect({dispatch: false})
  addTodo$ = this.actions$.pipe(
    ofType(TodoActions.TodoActionTypes.AddTodo),
    map((action: TodoActions.AddTodo) => action.payload),
    concatMap((todo: Todo) => this.dataService.createTodo(todo)),
  );

  @Effect({dispatch: false})
  toggleTodo$ = this.actions$.pipe(
    ofType(TodoActions.TodoActionTypes.ToggleTodoStatus),
    map((action: TodoActions.ToggleTodoStatus) => action.payload),
    concatMap((todo: Todo) => this.dataService.updateTodo(todo)),
  );

  @Effect({dispatch: false})
  updateTodo$ = this.actions$.pipe(
    ofType(TodoActions.TodoActionTypes.UpdateTodo),
    map((action: TodoActions.UpdateTodo) => action.payload),
    concatMap((todo: Todo) => this.dataService.updateTodo(todo)),
  );

  @Effect({dispatch: false})
  moveTodo$ = this.actions$.pipe(
    ofType(TodoActions.TodoActionTypes.MoveTodo),
    map((action: TodoActions.MoveTodo) => action.payload),
    exhaustMap(config => this.dataService.moveTodo(config)),
  );

  @Effect({dispatch: false})
  deleteTodo$ = this.actions$.pipe(
    ofType(TodoActions.TodoActionTypes.DeleteTodo),
    map((action: TodoActions.DeleteTodo) => action.payload),
    concatMap(todo => this.dataService.deleteTodo(todo)),
  );

  @Effect({dispatch: false})
  reorderTodos$ = this.actions$.pipe(
    ofType(TodoActions.TodoActionTypes.ReorderTodos),
    map((action: TodoActions.ReorderTodos) => action.payload),
    concatMap(ids => this.dataService.updateTodoIds(ids)),
  );
}
