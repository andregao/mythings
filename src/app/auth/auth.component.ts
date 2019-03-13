import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';
import { AppService } from '../core/app.service';

// validator function to check password matching
function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password.pristine || confirmPassword.pristine) {
    return null;
  }
  if (password.value !== confirmPassword.value) {
    return {passwordMatch: true};
  }
  return null;
}

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authType$: Observable<string>;
  signUpForm: FormGroup;
  signInForm: FormGroup;
  error: string; // to hold custom errors
  userSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private appService: AppService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon('google',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'));
  }

  ngOnInit() {
    this.appService.setTitle('');
    this.authType$ = this.route.url.pipe(
      map(url => url[0].path),
      tap(path => path === 'signin' ?
        this.appService.setTitle('Sign In to MaThangs') :
        this.appService.setTitle('Sign Up for MaThangs')
      )
    );
    this.buildForms();

    // monitor user login status until route change
    this.authService.currentUser$.pipe(
      takeUntil(this.router.events),
    ).subscribe(user => {
      // console.log('auth service emits user info to auth comp');
      if (user) {
        // console.log('auth comp received user, navigating home');
        this.router.navigateByUrl('/home');
      }
    });

    // monitor and debounce password match validation
    const passwordGroupControl = this.signUpForm.get('passwordGroup');
    const confirmPasswordControl = this.signUpForm.get('passwordGroup.confirmPassword');
    confirmPasswordControl.valueChanges.pipe(
      tap(() => this.error = ''),
      debounceTime(700),
    ).subscribe(() => {
      if (passwordGroupControl.hasError('passwordMatch')) {
        this.error = 'Passwords do not match';
      }
    });
  }

  buildForms() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: '',
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: [''],
      }, {validators: passwordMatch}),
    });

    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  onSignIn() {
    this.appService.startLoading();
    this.error = '';
    const {email, password} = this.signInForm.value;
    this.authService.signInWithEmail(email, password)
      .catch(error => {
        this.appService.stopLoading();
        switch (error.code) {
          case 'auth/wrong-password':
            return this.error = 'Wrong password';
          case 'auth/user-not-found':
            return this.error = 'User does not exist';
          case 'auth/invalid-email':
            return this.error = 'Invalid email address';
        }
      });
  }

  onSignUp() {
    this.appService.startLoading();
    this.error = '';
    const {firstName, lastName, email, passwordGroup: {confirmPassword}} = this.signUpForm.value;
    this.authService.signUpWithEmail(email, confirmPassword, `${firstName} ${lastName}`)
      .catch(error => {
        this.appService.stopLoading();
        switch (error.code) {
          case 'auth/email-already-in-use':
            return this.error = 'User already exist';
          case 'auth/invalid-email':
            return this.error = 'Invalid email address';
          case 'auth/weak-password':
            return this.error = 'Password is too simple';
        }
      });
  }

  onUseGoogle() {
    this.appService.startLoading();
    this.authService.signInWithGoogle()
      .catch(error => {
        this.appService.stopLoading();
        switch (error.code) {
          case 'auth/popup-blocked':
            return this.error = 'Pop up window blocked by browser';
          case 'auth/popup-closed-by-user':
            return this.error = 'Pop up window closed without signing in';
        }
      });
  }
}
