import { Action } from '@ngrx/store';

export enum StatusActionTypes {
  SetNeedData = '[Home] Set Data Status',
  SetShowCompleted = '[Home] Set Show Completed Status',
  SetCurrentProject = '[Home] Set Current Project',
  ToggleDrawer = '[Home] Toggle Drawer Opened',
  SetDrawerOpened = '[Home] Set Drawer Opened',
  SetHandsetMode = '[Home] Set Handset Mode',
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

export class ToggleDrawer implements Action {
  readonly type = StatusActionTypes.ToggleDrawer;
}

export class SetDrawerOpened implements Action {
  readonly type = StatusActionTypes.SetDrawerOpened;

  constructor(public payload: boolean) {
  }
}
export class SetHandsetMode implements Action {
  readonly type = StatusActionTypes.SetHandsetMode;

  constructor(public payload: boolean) {
  }
}

export type StatusActionsUnion =
  | SetShowCompleted
  | SetNeedData
  | SetCurrentProject
  | ToggleDrawer
  | SetHandsetMode
  | SetDrawerOpened;
