import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { UserDoc } from '../shared/models/user.model';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { AuthApiActions, AuthActions } from '../auth/actions';
import { Store } from '@ngrx/store';
import * as fromAuth from '../auth/reducers';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private currentUser = new BehaviorSubject<UserDoc | null>(null);
  currentUser$: Observable<UserDoc | null> = this.currentUser.asObservable();
  redirectUrl: string;
  userSub: Subscription;
  stopMonitoring = new Subject();

  constructor(
    private afAuth: AngularFireAuth,
    private store: Store<fromAuth.State>,
  ) {
    this.startMonitoringAuth();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  // for page refresh or signed in user came back, stops when manual auth
  startMonitoringAuth() {
    this.userSub = this.afAuth.user.pipe(
      takeUntil(this.stopMonitoring),
      tap(user => {
        if (!user) {
          this.store.dispatch(new AuthApiActions.NotSignedIn());
        }
      }),
      filter(user => !!user),
      take(1),
      map(user => {
        if (user.providerData && user.providerData[0].providerId === 'google.com') {
          // console.log('google user');
          const userData = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
          this.store.dispatch(new AuthApiActions.GoogleSignInSuccess(userData));
        }
        if (user.providerData && user.providerData[0].providerId === 'password') {
          // console.log('email user');
          this.store.dispatch(new AuthActions.GetUserData(user.uid));
        }
      })
    ).subscribe();
  }

  stopMonitoringAuth() {
    this.stopMonitoring.next();
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
    // this.getRedirectResult();
  }

  signInWithEmail(email: string, password: string) {
    this.stopMonitoringAuth();
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  signUpWithEmail(email: string, password: string) {
    this.stopMonitoringAuth();
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }


}
