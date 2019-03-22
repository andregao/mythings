import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../core/reducers';
import * as fromAuth from '../../auth/reducers';
import { AuthActions } from '../../auth/actions';
import { LayoutActions } from '../actions';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'mt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$ = this.store.pipe(select(fromAuth.getUser));
  clientIsHandset$ = this.store.pipe(select(fromRoot.drawerMode));
  showMenuButton$ = combineLatest(
    this.currentUser$.pipe(map(user => !!user)),
    this.clientIsHandset$.pipe(map(mode => mode === 'over')),
  ).pipe(map(([isSignedIn, isHandset]) => isSignedIn && isHandset));
  // toggleButtonIcon$ = this.store.pipe(
  //   select(fromRoot.isDrawerOpened),
  //   map(opened => opened ? 'chevron_left' : 'menu')
  // );
  constructor(
    private store: Store<fromRoot.State>,
  ) {
  }

  ngOnInit() {
  }

  toggleDrawer() {
    this.store.dispatch(new LayoutActions.ToggleDrawer());
  }

  onSignOut() {
    this.store.dispatch(new AuthActions.SignOut());
  }
}
