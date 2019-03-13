import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDoc } from '../shared/models/user-doc.model';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<UserDoc | null>(null);
  currentUser$: Observable<UserDoc | null> = this.currentUser.asObservable();
  redirectUrl: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private dataService: DataService,
    private appService: AppService,
  ) {
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
  }


  async signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    await this.afAuth.auth.signInWithRedirect(provider);
    return this.afAuth.auth.getRedirectResult();
  }

  signInWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(data => {
        const userData = {
          uid: data.user.uid,
          email: data.user.email,
          displayName,
          photoURL: null,
        };
        this.dataService.updateUserDoc(userData)
          .then(() => this.dataService.getUserData()
            .then(user => this.currentUser.next(user))
          );
      })
      .catch(error => {
        throw error;
      });
  }


  signOut() {
    this.afAuth.auth.signOut()
      .then(() => this.router.navigateByUrl('/'));
    this.currentUser.next(null);
  }


}
