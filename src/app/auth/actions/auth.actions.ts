import { Action } from '@ngrx/store';
import { UserDoc } from '../../shared/models/user.model';

export enum AuthActionTypes {
  GetUserDataGoogleSignIn = '[Auth] Get User Data Google Sign In',
  GetUserData = '[Auth] Get User Data',
  InitializeNewUser = '[Auth] Initialize New User',
  GetUserDataSuccess = '[Auth] Get User Data Success',
  UpdateUserData = '[Auth] Update User Data',
  UpdateUserDataSuccess = '[Auth] Update User Data Success',
  SignOut = '[Auth] Sign Out',
  SignOutSuccess = '[Auth] Sign Out Success',
}

export class GetUserData implements Action {
  readonly type = AuthActionTypes.GetUserData;

  constructor(public payload: string) {
  }
}

export class GetUserDataGoogleSignIn implements Action {
  readonly type = AuthActionTypes.GetUserDataGoogleSignIn;

  constructor(public payload: UserDoc) {
  }
}

export class InitializeNewUser implements Action {
  readonly type = AuthActionTypes.InitializeNewUser;

  constructor(public payload: UserDoc) {
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

export class UpdateUserDataSuccess implements Action {
  readonly type = AuthActionTypes.UpdateUserDataSuccess;

  constructor(public payload: string) {
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
  | GetUserDataGoogleSignIn
  | InitializeNewUser
  | GetUserDataSuccess
  | UpdateUserData
  | UpdateUserDataSuccess
  | SignOut
  | SignOutSuccess;
