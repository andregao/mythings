import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { Credentials, SignUpInfo } from '../../shared/models/user.model';
import { AuthActions, AuthApiActions, AuthPageActions, } from '../actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<AuthPageActions.AuthPageActionsUnion>,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
  ) {
  }

  @Effect()
  signIn$ = this.actions$.pipe(
    ofType(AuthPageActions.AuthPageActionTypes.SignIn),
    map(action => action.payload),
    switchMap(({email, password}: Credentials) =>
      this.authService.signInWithEmail(email, password).pipe(
        map(signedIn => new AuthActions.GetUserData(signedIn.user.uid)),
        catchError(error => of(new AuthApiActions.SignInFailure(error.code))),
      ),
    ),
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
    map(userData => new AuthActions.UpdateUserData(userData)),
  );

  @Effect({dispatch: false})
  updateUserData$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.UpdateUserData),
    map((action: AuthActions.UpdateUserData) => action.payload),
    tap(userData => this.dataService.updateUserDoc(userData)),
  );

  @Effect()
  UpdateUserDataSuccess$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.UpdateUserDataSuccess, AuthActions.AuthActionTypes.UpdateUserDataSkipped),
    map((action: AuthActions.UpdateUserDataSuccess | AuthActions.UpdateUserDataSkipped) => action.payload),
    map(id => new AuthActions.GetUserData(id)),
  );

  @Effect()
  getUserData$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.GetUserData),
    map((action: AuthActions.GetUserData) => action.payload),
    switchMap(id => this.dataService.getUserData(id).pipe(
      // takeUntil(this.actions$.pipe(ofType(AuthActions.AuthActionTypes.SignOut))),
      map(userData => new AuthActions.GetUserDataSuccess(userData)),
      catchError(error => of(new AuthApiActions.SignInFailure(error))),
    )),
  );

  @Effect({dispatch: false})
  getUserDataSuccess$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.GetUserDataSuccess),
    tap(() => this.router.navigateByUrl('/home')),
  );

  @Effect()
  signUp$ = this.actions$.pipe(
    ofType(AuthPageActions.AuthPageActionTypes.SignUp),
    map(action => action.payload),
    exhaustMap((info: SignUpInfo) =>
      from(this.authService.signUpWithEmail(info.email, info.password)).pipe(
        map(signedUp => {
          const userDoc = {
            id: signedUp.user.uid,
            email: signedUp.user.email,
            displayName: `${info.firstName} ${info.lastName}`,
            photoURL: null,
          };
          return new AuthActions.CreateUserData(userDoc);
        }),
        catchError(error => of(new AuthApiActions.SignUpFailure(error.code))),
      )
    ));


  @Effect()
  createUserData = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.CreateUserData),
    map((action: AuthActions.CreateUserData) => action.payload),
    switchMap(userDoc => from(this.dataService.createNewUser(userDoc))),
    map(userData => new AuthActions.GetUserDataSuccess(userData)),
  );

  @Effect()
  signOut$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.SignOut),
    exhaustMap(() => from(this.authService.signOut())),
    map(() => new AuthActions.SignOutSuccess()),
  );

  @Effect({dispatch: false})
  signOutSuccess$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.SignOutSuccess),
    tap(() => this.router.navigateByUrl('/')),
  );
}
