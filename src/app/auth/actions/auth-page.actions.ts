import { Action } from '@ngrx/store';
import { Credentials, SignUpInfo } from '../../shared/models/user.model';

export enum AuthPageActionTypes {
  SignIn = '[Auth Page] Sign In',
  SignUp = '[Auth Page] Sign Up',
  GoogleSignIn = '[Auth Page] Google Sign In',
}

export class SignIn implements Action {
  readonly type = AuthPageActionTypes.SignIn;

  constructor(public payload: Credentials) {
  }
}

export class SignUp implements Action {
  readonly type = AuthPageActionTypes.SignUp;

  constructor(public payload: SignUpInfo) {
  }
}

export class GoogleSignIn implements Action {
  readonly type = AuthPageActionTypes.GoogleSignIn;
}

export type AuthPageActionsUnion = SignIn
  | SignUp
  | GoogleSignIn;
