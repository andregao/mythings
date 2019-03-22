import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { AppService } from '../../core/app.service';
import * as fromAuth from '../reducers';
import { AuthPageActions, } from '../actions';
import { select, Store } from '@ngrx/store';
import { SignUpInfo } from '../../shared/models/user.model';
import { LayoutActions } from '../../core/actions';

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
export class AuthComponent implements OnInit, OnDestroy {
  authType$: Observable<string>;
  userSub: Subscription;
  signUpForm: FormGroup;
  signInForm: FormGroup;
  error: string; // to hold custom errors
  error$ = this.store.pipe(select(fromAuth.getAuthPageError));

  passwordControlSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private appService: AppService,
    private store: Store<fromAuth.State>,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon('google',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/google.svg'));
  }

  ngOnInit() {
    // redirect when signed in
    this.userSub = this.store.pipe(
      select(fromAuth.isSignedIn),
      filter(signedIn => signedIn),
    ).subscribe(signedIn => this.appService.navigate('/home'));

    this.authType$ = this.route.url.pipe(
      map(url => url[0].path),
      tap(path => path === 'signin' ?
        this.store.dispatch(new LayoutActions.SetTitle('Sign In to mathangs.com')) :
        this.store.dispatch(new LayoutActions.SetTitle('Sign Up for mathangs.com'))
      )
    );
    this.buildForms();

    // monitor and debounce password match validation
    const passwordGroupControl = this.signUpForm.get('passwordGroup');
    const confirmPasswordControl = this.signUpForm.get('passwordGroup.confirmPassword');
    this.passwordControlSub = confirmPasswordControl.valueChanges.pipe(
      tap(() => this.error = ''),
      debounceTime(700),
    ).subscribe(() => {
      if (passwordGroupControl.hasError('passwordMatch')) {
        this.error = 'Passwords do not match';
      }
    });
  }

  ngOnDestroy(): void {
    this.passwordControlSub.unsubscribe();
    this.userSub.unsubscribe();
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
    this.store.dispatch(new AuthPageActions.SignIn(this.signInForm.value));
  }

  onSignUp() {
    const {firstName, lastName, email, passwordGroup: {confirmPassword: password}} = this.signUpForm.value;
    const signUpInfo: SignUpInfo = {email, password, firstName, lastName};
    this.store.dispatch(new AuthPageActions.SignUp(signUpInfo));
  }

  onUseGoogle() {
    this.store.dispatch(new AuthPageActions.GoogleSignIn());
  }
}
