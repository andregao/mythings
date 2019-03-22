import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  SetTitle = '[Layout] Set Title',
  ToggleDrawer = '[Layout] Toggle Drawer',
  SetDrawerOpened = '[Layout] Set Drawer Opened',
  SetDrawerMode = '[Layout] Set Drawer Mode',
}

export class SetTitle implements Action {
  readonly type = LayoutActionTypes.SetTitle;

  constructor(public payload: string) {
  }
}
export class ToggleDrawer implements Action {
  readonly type = LayoutActionTypes.ToggleDrawer;
}

export class SetDrawerOpened implements Action {
  readonly type = LayoutActionTypes.SetDrawerOpened;

  constructor(public payload: boolean) {
  }
}
export class SetDrawerMode implements Action {
  readonly type = LayoutActionTypes.SetDrawerMode;

  constructor(public payload: string) {
  }
}

export type LayoutActionUnion =
  | SetTitle
  | ToggleDrawer
  | SetDrawerOpened
  | SetDrawerMode;
