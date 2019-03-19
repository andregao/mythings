import { Todo } from '../../shared/models/todo.model';
import { TodoActions } from '../actions';

export interface State extends Array<Todo> {
}

const initialState: State = [];

export function reducer(
  state = initialState,
  action: TodoActions.TodoActionsUnion,
): State {
  switch (action.type) {
    case TodoActions.TodoActionTypes.SyncTodos: {
      return [
        ...action.payload,
      ];
    }
    case TodoActions.TodoActionTypes.ClearTodos: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

