import { Injectable } from '@angular/core';
import { AuthActions, AuthApiActions, AuthPageActions } from '../../auth/actions';
import { DataActions, TodoActions } from '../../home/actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { LoaderActions } from '../actions';
import { WelcomeActions } from '../../info/actions';

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
  WelcomeActions.WelcomeActionTypes.GetContent,
  // data
  DataActions.DataActionTypes.StartSyncingData,
];

const stopActions = [
  // auth
  AuthApiActions.AuthApiActionTypes.SignInFailure,
  AuthApiActions.AuthApiActionTypes.SignUpFailure,
  AuthApiActions.AuthApiActionTypes.NotSignedIn,
  AuthActions.AuthActionTypes.GetUserDataSuccess,
  // info
  WelcomeActions.WelcomeActionTypes.GetContentSuccess,
  WelcomeActions.WelcomeActionTypes.GetContentFailure,
  WelcomeActions.WelcomeActionTypes.GetContentSkpped,
  // data
  DataActions.DataActionTypes.InitialSyncSuccess,
];

@Injectable()
export class LoaderEffects {
  constructor(private actions$: Actions) {
  }

  @Effect()
  showUpload$ = this.actions$.pipe(
    ofType(...uploadActions),
    map(() => new LoaderActions.StartUpload())
  );

  @Effect()
  showDownload$ = this.actions$.pipe(
    ofType(...downloadActions),
    map(() => new LoaderActions.StartDownload())
  );

  @Effect()
  stopLoading$ = this.actions$.pipe(
    ofType(...stopActions),
    map(() => new LoaderActions.StopLoading())
  );
}
