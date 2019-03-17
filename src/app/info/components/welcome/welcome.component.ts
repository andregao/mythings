import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../core/app.service';
import { Observable } from 'rxjs';
import { DataService } from '../../../core/data.service';
import { select, Store } from '@ngrx/store';
import * as fromWelcome from '../../reducers';
import * as welcomeActions from '../../actions/welcome.actions';
import * as fromAuth from '../../../auth/reducers';
import { State } from '../../../app.state';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isSignedIn$ = this.store.pipe(select(fromAuth.getSignedIn));
  content$: Observable<object>;

  constructor(
    private appService: AppService,
    private dataService: DataService,
    private store: Store<State>,
  ) {
    this.store.dispatch(new welcomeActions.GetContent());
  }

  ngOnInit() {
    this.appService.setTitle('Welcome to MaThangs');
    // this.isSignedIn$ = this.authService.currentUser$.pipe(
    //   map(user => !!user),
    //   tap(() => this.appService.stopLoading()),
    // );

    this.content$ = this.store.pipe(select(fromWelcome.getWelcomeContent));

  }

}
