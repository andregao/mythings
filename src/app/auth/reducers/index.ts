import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../app.state';
import * as fromAuth from '../reducers/auth.reducer';

// extends root Store
export interface State extends fromRoot.State {
  auth: fromAuth.State;
}



// selectors
const selectAuthState = createFeatureSelector<fromAuth.State>('auth');


export const getUser = createSelector(selectAuthState, fromAuth.getUser);
export const getSignedIn = createSelector(getUser, user => !!user);

export const getAuthPageError = createSelector(selectAuthState, fromAuth.getError);
