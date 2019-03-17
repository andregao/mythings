import { Action } from '@ngrx/store';

export enum WelcomeActionTypes {
  GetContent = '[Welcome] Get Content',
  GetContentSkpped = '[Welcome] Get Content Skipped',
  GetContentSuccess = '[Welcome] Get Content Success',
  GetContentFailure = '[Welcome] Get Content Failure',
}

export class GetContent implements Action {
  readonly type = WelcomeActionTypes.GetContent;
}

export class GetContentSkipped implements Action {
  readonly type = WelcomeActionTypes.GetContentSkpped;
}

export class GetContentSuccess implements Action {
  readonly type = WelcomeActionTypes.GetContentSuccess;

  constructor(public payload: {}) {
  }
}

export class GetContentFailure implements Action {
  readonly type = WelcomeActionTypes.GetContentFailure;

  constructor(public payload: any) {
  }
}

export type WelcomeActionsUnion =
  | GetContent
  | GetContentSkipped
  | GetContentSuccess
  | GetContentFailure;
