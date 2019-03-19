import { Action } from '@ngrx/store';

export enum TitleActionTypes {
  SetTitle = '[Title] Set Title',
}

export class SetTitle implements Action {
  readonly type = TitleActionTypes.SetTitle;

  constructor(public payload: string) {
  }
}

export type TitleActionUnion =
  | SetTitle;
