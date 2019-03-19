import { Action } from '@ngrx/store';

export enum DataActionTypes {
  StartSyncingData = '[Home] Start Syncing Data',
  InitialSyncSuccess = '[Home] Initial Sync Success',
}

export class StartSyncingData implements Action {
  readonly type = DataActionTypes.StartSyncingData;
}

export class InitialSyncSuccess implements Action {
  readonly type = DataActionTypes.InitialSyncSuccess;
}

export type DataActionsUnion =
  | StartSyncingData
  | InitialSyncSuccess;

