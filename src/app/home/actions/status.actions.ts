import { Action } from '@ngrx/store';

export enum StatusActionTypes {
  SetNeedData = '[Home] Set Data Status',
  SetShowCompleted = '[Home] Set Show Completed Status',
  SetCurrentProject = '[Home] Set Current Project',

}

export class SetNeedData implements Action {
  readonly type = StatusActionTypes.SetNeedData;

  constructor(public payload: boolean) {
  }
}

export class SetShowCompleted implements Action {
  readonly type = StatusActionTypes.SetShowCompleted;

  constructor(public payload: boolean) {
  }
}

export class SetCurrentProject implements Action {
  readonly type = StatusActionTypes.SetCurrentProject;

  constructor(public payload: string) {
  }
}

export type StatusActionsUnion =
  | SetShowCompleted
  | SetNeedData
  | SetCurrentProject;
