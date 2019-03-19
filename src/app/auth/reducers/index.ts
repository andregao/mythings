import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../core/reducers';
import * as fromAuth from './auth.reducer';

// extends root Store
export interface State extends fromRoot.State {
  auth: fromAuth.State;
}

// selectors
const selectAuthState = createFeatureSelector<State, fromAuth.State>('auth');

export const getUser = createSelector(selectAuthState, fromAuth.getUser);
export const getSignedIn = createSelector(getUser, user => !!user);
export const getProjectIds = createSelector(getUser, user => user ? user.projectIds : null);

export const getAuthPageError = createSelector(selectAuthState, fromAuth.getError);
