import * as fromLoader from './loader.reducer';
import * as fromTitle from './title.reducer';
import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { LoaderEffects } from '../effects/loader.effects';
import { AuthActions } from '../../auth/actions';

export interface State {
  loader: fromLoader.State;
  title: fromTitle.State;
}

// root reducers
export const reducers: ActionReducerMap<State> = {
  loader: fromLoader.reducer,
  title: fromTitle.reducer,
};

// root metaReducers
export const metaReducers: MetaReducer<State>[] = [];

// root effects
export const effects = [
  LoaderEffects,
];

// selectors
const selectLoaderState = createFeatureSelector<fromLoader.State>('loader');
export const isAppLoading = createSelector(
  selectLoaderState,
  fromLoader.getIsLoading,
);
export const getLoaderType = createSelector(
  selectLoaderState,
  fromLoader.getLoaderType,
);

const selectTitleState = createFeatureSelector<fromTitle.State>('title');
export const getTitle = createSelector(
  selectTitleState,
  fromTitle.getTitle,
);


