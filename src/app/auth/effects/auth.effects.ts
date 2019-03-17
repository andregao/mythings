import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, switchMap, take, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { Credentials, SignUpInfo } from '../../shared/models/user.model';
import { AuthActions, AuthApiActions, AuthPageActions, } from '../actions';
import { AppService } from '../../core/app.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<AuthPageActions.AuthPageActionsUnion>,
    private authService: AuthService,
    private dataService: DataService,
    private appService: AppService,
  ) {
  }

  @Effect()
  signIn$ = this.actions$.pipe(
    ofType(AuthPageActions.AuthPageActionTypes.SignIn),
    map(action => action.payload),
    switchMap(({email, password}: Credentials) =>
      this.authService.signInWithEmail(email, password).pipe(
        map(signedIn => new AuthApiActions.SignInSuccess(signedIn.user.uid)),
        catchError(error => of(new AuthApiActions.SignInFailure(error.code))),
      ),
    ),
  );

  @Effect()
  signInSuccess$ = this.actions$.pipe(
    ofType(AuthApiActions.AuthApiActionTypes.SignInSuccess),
    map((action: AuthApiActions.SignInSuccess) => action.payload),
    map(id => new AuthActions.GetUserData(id)),
  );

  @Effect({dispatch: false})
  googleSignIn$ = this.actions$.pipe(
    ofType(AuthPageActions.AuthPageActionTypes.GoogleSignIn),
    tap(() => this.authService.signInWithGoogle()),
  );

  @Effect()
  googleSignInSuccess$ = this.actions$.pipe(
    ofType(AuthApiActions.AuthApiActionTypes.GoogleSignInSuccess),
    map((action: AuthApiActions.GoogleSignInSuccess) => action.payload),
    map(userData => new AuthActions.GetUserDataGoogleSignIn(userData)),
  );

  @Effect()
  getUserData$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.GetUserData),
    map((action: AuthActions.GetUserData) => action.payload),
    switchMap(id => this.dataService.getUserData(id).pipe(
      take(1),
      map(userData => new AuthActions.GetUserDataSuccess(userData)),
      catchError(error => of(new AuthApiActions.SignInFailure(error.code))),
    )),
  );

  @Effect({dispatch: false})
  getUserDataGoogleSignIn$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.GetUserDataGoogleSignIn),
    map((action: AuthActions.GetUserDataGoogleSignIn) => action.payload),
    tap(data => this.dataService.getUserDataGoogle(data)),
  );

  @Effect({dispatch: false})
  initializeNewUser$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.InitializeNewUser),
    map((action: AuthActions.InitializeNewUser) => action.payload),
    tap(data => this.dataService.initializeNewUser(data)),
  );

  @Effect({dispatch: false})
  getUserDataSuccess$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.GetUserDataSuccess),
    map((action: AuthActions.GetUserDataSuccess) => action),
    tap(() => this.appService.navigate('/home')),
  );

  @Effect({dispatch: false})
  updateUserData$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.UpdateUserData),
    map((action: AuthActions.UpdateUserData) => action.payload),
    tap(userData => this.dataService.updateUserDoc(userData)),
  );

  @Effect()
  signUp$ = this.actions$.pipe(
    ofType(AuthPageActions.AuthPageActionTypes.SignUp),
    map((action: AuthPageActions.SignUp) => action.payload),
    exhaustMap((info: SignUpInfo) =>
      from(this.authService.signUpWithEmail(info.email, info.password)).pipe(
        map(signedUp => {
          const userData = {
            id: signedUp.user.uid,
            email: signedUp.user.email,
            displayName: `${info.firstName} ${info.lastName}`,
            photoURL: null,
          };
          return new AuthActions.InitializeNewUser(userData);
        }),
        catchError(error => of(new AuthApiActions.SignUpFailure(error.code))),
      )
    ));

  @Effect()
  signOut$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.SignOut),
    exhaustMap(() => from(this.authService.signOut())),
    map(() => new AuthActions.SignOutSuccess()),
  );

  @Effect({dispatch: false})
  signOutSuccess$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.SignOutSuccess),
    tap(() => this.appService.navigate('/')),
  );
}
