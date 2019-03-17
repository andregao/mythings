import * as fromWelcome from './welcome.reducer';
import * as fromRoot from '../../app.state';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

interface InfoState {
  welcome: fromWelcome.State;
}

export interface State extends fromRoot.State {
  info: InfoState;
}

export const reducers: ActionReducerMap<InfoState> = {
  welcome: fromWelcome.reducer
};

// selectors
const selectInfoState = createFeatureSelector<State, InfoState>('info');
const selectWelcomeState = createSelector(
  selectInfoState,
  (state: InfoState) => state.welcome
);

export const getWelcomeContent = createSelector(selectWelcomeState, fromWelcome.getContent);
export const getWelcomeUpdateTime = createSelector(selectWelcomeState, fromWelcome.getUpdateTime);
export const getWelcomeError = createSelector(selectWelcomeState, fromWelcome.getError);


