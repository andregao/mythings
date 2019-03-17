import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { UserDoc } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AppService } from './app.service';
import { map } from 'rxjs/operators';
import { AuthApiActions } from '../auth/actions';
import { Store } from '@ngrx/store';
import * as fromAuth from '../auth/reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private currentUser = new BehaviorSubject<UserDoc | null>(null);
  currentUser$: Observable<UserDoc | null> = this.currentUser.asObservable();
  redirectUrl: string;
  userSub: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private store: Store<fromAuth.State>,
    private router: Router,
    private dataService: DataService,
    private appService: AppService,
  ) {
    // Google OAuth redirect flow work around
    this.userSub = this.afAuth.user.pipe(
      map(user => {
        if (user) {
          if (user.providerData && user.providerData[0].providerId === 'google.com') {
            const userData = {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            };
            this.store.dispatch(new AuthApiActions.GoogleSignInSuccess(userData));
          }
          if (user.providerData && user.providerData[0].providerId === 'password') {

          }
        } else {
          this.store.dispatch(new AuthApiActions.NotSignedIn());
        }
      })
    ).subscribe();
    /*
    this.afAuth.user.subscribe(user => {
      this.appService.startLoading();
      if (user) {
        // console.log('firebase auth reports a user', user);
        // Google sign in: update user data
        if (user.providerData && user.providerData[0].providerId === 'google.com') {
          this.dataService.updateUserDoc(user)
            .then(() => this.dataService.setCurrentUser(user)
              .then(userData => this.currentUser.next(userData))
            );
        }
        // email sign in
        if (user.providerData && user.providerData[0].providerId === 'password') {
          this.dataService.setCurrentUser(user)
            .then(userData => {
                // console.log(userData);
                this.currentUser.next(userData);
                // this.signOut();
              }
            );
        }
      } else {
        // console.log('no signed in user');
        this.appService.stopLoading();
      }
    });
    */
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
    // .then(() => {
    //   console.log('done with redicret');
    //   this.afAuth.auth.getRedirectResult().then(result => {
    //     console.log('result is:', result);
    //   });
    // });
  }

  getRedirectResult() {
    return this.afAuth.auth.getRedirectResult();
  }

  signInWithEmail(email: string, password: string) {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password));
    // return this.afAuth.authState;
    // return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string) {
    // return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    //   .then(data => {
    //     const userData = {
    //       uid: data.user.uid,
    //       email: data.user.email,
    //       displayName,
    //       photoURL: null,
    //     };
    //     this.dataService.updateUserDoc(userData)
    //       .then(() => this.dataService.getUserData()
    //         .then(user => this.currentUser.next(user))
    //       );
    //   })
    //   .catch(error => {
    //     throw error;
    //   });

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  }


  signOut() {
    return this.afAuth.auth.signOut();
  }


}
