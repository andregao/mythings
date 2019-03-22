import * as fromLoader from './loader.reducer';
import * as fromLayout from './layout.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { LoaderEffects } from '../effects/loader.effects';

export interface State {
  loader: fromLoader.State;
  layout: fromLayout.State;
}

// root reducers
export const reducers: ActionReducerMap<State> = {
  loader: fromLoader.reducer,
  layout: fromLayout.reducer,
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

const selectLayoutState = createFeatureSelector<fromLayout.State>('layout');
export const getTitle = createSelector(
  selectLayoutState,
  fromLayout.getTitle,
);
export const shouldDrawerOpen = createSelector(selectLayoutState, fromLayout.shouldDrawerOpen);
export const drawerMode = createSelector(selectLayoutState, fromLayout.getDrawerMode);

