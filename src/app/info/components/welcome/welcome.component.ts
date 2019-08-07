import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../core/app.service';
import { DataService } from '../../../core/data.service';
import { select, Store } from '@ngrx/store';
import * as fromWelcome from '../../reducers';
import * as welcomeActions from '../../actions/welcome.actions';
import * as fromAuth from '../../../auth/reducers';
import { State } from '../../../core/reducers';
import { LayoutActions } from '../../../core/actions';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isSignedIn$ = this.store.pipe(select(fromAuth.isSignedIn));
  content$ = this.store.pipe(select(fromWelcome.getWelcomeContent));

  constructor(
    private appService: AppService,
    private dataService: DataService,
    private store: Store<State>,
  ) {
    this.store.dispatch(new LayoutActions.SetTitle('Welcome to Thangs'));
    this.store.dispatch(new welcomeActions.GetContent());
  }

  ngOnInit() {

  }

}
