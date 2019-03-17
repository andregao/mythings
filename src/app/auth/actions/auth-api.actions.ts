import { Action } from '@ngrx/store';
import { UserDoc } from '../../shared/models/user.model';

export enum AuthApiActionTypes {
  SignInSuccess = '[Auth API] Sign In Success',
  GoogleSignInSuccess = '[Auth API] Google Sign In Success',
  SignInFailure = '[Auth API] Sign In Failure',
  SignUpSuccess = '[Auth API] Sign Up Success',
  SignUpFailure = '[Auth API] Sign Up Failure',
  NotSignedIn = '[Auth API] Not Signed In',
}


export class SignInSuccess implements Action {
  readonly type = AuthApiActionTypes.SignInSuccess;

  constructor(public payload: UserDoc) {
  }
}

export class GoogleSignInSuccess implements Action {
  readonly type = AuthApiActionTypes.GoogleSignInSuccess;

  constructor(public payload: UserDoc) {
  }
}

export class SignInFailure implements Action {
  readonly type = AuthApiActionTypes.SignInFailure;

  constructor(public payload: any) {
  }
}

export class SignUpSuccess implements Action {
  readonly type = AuthApiActionTypes.SignUpSuccess;

  constructor(public payload: UserDoc) {
  }
}

export class SignUpFailure implements Action {
  readonly type = AuthApiActionTypes.SignUpFailure;

  constructor(public payload: any) {
  }
}

export class NotSignedIn implements Action {
  readonly type = AuthApiActionTypes.NotSignedIn;
}

export type AuthApiActionsUnion =
  | SignInSuccess
  | GoogleSignInSuccess
  | SignUpSuccess
  | SignInFailure
  | SignUpFailure
  | NotSignedIn;
