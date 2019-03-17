import * as fromLoader from './core/reducers/loader.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { LoaderEffects } from './core/effects/loader.effects';

export interface State {
  loader: fromLoader.State;
}

// root reducers
export const reducers = {
  loader: fromLoader.reducer,
};

// root effects
export const effects = [
  LoaderEffects,
];

// selectors
export const selectLoaderState = createFeatureSelector<fromLoader.State>('loader');
export const isAppLoading = createSelector(
  selectLoaderState,
  fromLoader.getIsLoading,
);
export const getLoaderType = createSelector(
  selectLoaderState,
  fromLoader.getLoaderType,
);
