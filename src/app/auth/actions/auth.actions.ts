import { Action } from '@ngrx/store';
import { UserDoc } from '../../shared/models/user.model';

export enum AuthActionTypes {
  GetUserData = '[Auth] Get User Data',
  GetUserDataSuccess = '[Auth] Get User Data Success',
  UpdateUserData = '[Auth] Update User Data',
  UpdateUserDataSkipped = '[Auth] Update User Data Skipped',
  UpdateUserDataSuccess = '[Auth] Update User Data Success',
  CreateUserData = '[Auth] Create User Data',
  SignOut = '[Auth] Sign Out',
  SignOutSuccess = '[Auth] Sign Out Success',
}

export class GetUserData implements Action {
  readonly type = AuthActionTypes.GetUserData;

  constructor(public payload: string) {
  }
}

export class GetUserDataSuccess implements Action {
  readonly type = AuthActionTypes.GetUserDataSuccess;

  constructor(public payload: UserDoc) {
  }
}

export class UpdateUserData implements Action {
  readonly type = AuthActionTypes.UpdateUserData;

  constructor(public payload: UserDoc) {
  }
}

export class UpdateUserDataSkipped implements Action {
  readonly type = AuthActionTypes.UpdateUserDataSkipped;

  constructor(public payload: string) {
  }
}

export class UpdateUserDataSuccess implements Action {
  readonly type = AuthActionTypes.UpdateUserDataSuccess;

  constructor(public payload: string) {
  }
}
export class CreateUserData implements Action {
  readonly type = AuthActionTypes.CreateUserData;

  constructor(public payload: UserDoc) {
  }
}

export class SignOut implements Action {
  readonly type = AuthActionTypes.SignOut;
}

export class SignOutSuccess implements Action {
  readonly type = AuthActionTypes.SignOutSuccess;
}


export type AuthActionsUnion =
  | GetUserData
  | GetUserDataSuccess
  | UpdateUserData
  | UpdateUserDataSkipped
  | UpdateUserDataSuccess
  | CreateUserData
  | SignOut
  | SignOutSuccess;
