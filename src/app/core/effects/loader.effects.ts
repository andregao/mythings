import { Injectable } from '@angular/core';
import { AuthActions, AuthApiActions, AuthPageActions } from '../../auth/actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as fromLoader from '../actions/loader.actions';
import * as welcomeActions from '../../info/actions/welcome.actions';

/*
Map action events to each loading status,
spread them into effect type filters,
dispatch actual actions that change the loading state
*/
const uploadActions = [
  AuthPageActions.AuthPageActionTypes.SignIn,
  AuthPageActions.AuthPageActionTypes.SignUp,
  AuthPageActions.AuthPageActionTypes.GoogleSignIn,
  AuthActions.AuthActionTypes.UpdateUserData,
];

const downloadActions = [
  // auth
  AuthActions.AuthActionTypes.GetUserData,
  AuthActions.AuthActionTypes.GetUserDataGoogleSignIn,
  AuthActions.AuthActionTypes.InitializeNewUser,
  // info
  welcomeActions.WelcomeActionTypes.GetContent,
];

const stopActions = [
  // auth
  AuthApiActions.AuthApiActionTypes.SignInFailure,
  AuthApiActions.AuthApiActionTypes.SignUpFailure,
  AuthApiActions.AuthApiActionTypes.NotSignedIn,
  AuthActions.AuthActionTypes.GetUserDataSuccess,
  // info
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
