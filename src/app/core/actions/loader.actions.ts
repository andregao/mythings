import { Action } from '@ngrx/store';

export enum LoaderActionTypes {
  StartUpload = '[Loading] Start Upload',
  StartDownload = '[Loading] Start Download',
  StopLoading = '[Loading] Stop Loading',
}

export class StartUpload implements Action {
  readonly type = LoaderActionTypes.StartUpload;
}

export class StartDownload implements Action {
  readonly type = LoaderActionTypes.StartDownload;
}

export class StopLoading implements Action {
  readonly type = LoaderActionTypes.StopLoading;
}

export type LoaderActionUnion = StartUpload
  | StartDownload
  | StopLoading;
