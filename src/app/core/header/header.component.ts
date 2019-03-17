import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppService } from '../app.service';
import { select, Store } from '@ngrx/store';
import * as fromAuth from '../../auth/reducers';
import { AuthActions } from '../../auth/actions';

@Component({
  selector: 'mt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$ = this.store.pipe(select(fromAuth.getUser));

  constructor(
    private store: Store<fromAuth.State>,
  ) {
  }

  ngOnInit() {
  }

  onSignOut() {
    this.store.dispatch(new AuthActions.SignOut());
  }
}
