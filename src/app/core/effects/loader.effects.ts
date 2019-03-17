import { Injectable } from '@angular/core';
import { AuthActions, AuthApiActions, AuthPageActions } from '../../auth/actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as fromLoader from '../actions/loader.actions';
import * as welcomeActions from '../../info/actions/welcome.actions';

const uploadActions = [
  AuthPageActions.AuthPageActionTypes.SignIn,
  AuthPageActions.AuthPageActionTypes.SignUp,
  AuthPageActions.AuthPageActionTypes.GoogleSignIn,
  AuthActions.AuthActionTypes.UpdateUserData,
];

const downloadActions = [
  AuthActions.AuthActionTypes.GetUserData,
  welcomeActions.WelcomeActionTypes.GetContent,
];

const stopActions = [
  // auth actions
  // AuthActions.AuthActionTypes.UpdateUserDataSuccess,
  AuthActions.AuthActionTypes.GetUserDataSuccess,
  AuthApiActions.AuthApiActionTypes.SignInSuccess,
  AuthApiActions.AuthApiActionTypes.SignInFailure,
  AuthApiActions.AuthApiActionTypes.SignUpSuccess,
  AuthApiActions.AuthApiActionTypes.SignUpFailure,
  AuthApiActions.AuthApiActionTypes.NotSignedIn,
  // info actions
  welcomeActions.WelcomeActionTypes.GetContentSuccess,
  welcomeActions.WelcomeActionTypes.GetContentFailure,
  welcomeActions.WelcomeActionTypes.GetContentSkpped,
];

@Injectable()
export class LoaderEffects {
  constructor(private actions$: Actions) {
  }

  @Effect()
  showUpload$ = this.actions$.pipe(
    ofType(...uploadActions),
    map(() => new fromLoader.StartUpload())
  );

  @Effect()
  showDownload$ = this.actions$.pipe(
    ofType(...downloadActions),
    map(() => new fromLoader.StartDownload())
  );

  @Effect()
  stopLoading$ = this.actions$.pipe(
    ofType(...stopActions),
    map(() => new fromLoader.StopLoading())
  );
}
