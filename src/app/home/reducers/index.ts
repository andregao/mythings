import * as fromRoot from '../../core/reducers';
import * as fromProjects from './projects.reducer';
import * as fromTodos from './todos.reducer';
import * as fromStatus from './status.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectEffects } from '../effects/project.effects';
import { TodoEffects } from '../effects/todo.effects';
import { DataEffects } from '../effects/data.effects';

interface HomeState {
  projects: fromProjects.State;
  todos: fromTodos.State;
  status: fromStatus.State;
}

export interface State extends fromRoot.State {
  home: HomeState;
}

export const reducers: ActionReducerMap<HomeState> = {
  projects: fromProjects.reducer,
  todos: fromTodos.reducer,
  status: fromStatus.reducer,
};

export const effects = [DataEffects, ProjectEffects, TodoEffects];
/*
  selectors
*/
const selectHomeState = createFeatureSelector<State, HomeState>('home');

// status selectors
const selectStatusState = createSelector(
  selectHomeState,
  (state: HomeState) => state.status
);
export const needData = createSelector(selectStatusState, fromStatus.getNeedData);
export const currentProjectId = createSelector(selectStatusState, fromStatus.getCurrentProjectId);
export const isDrawerOpened = createSelector(selectStatusState, fromStatus.getDrawerOpened);
export const drawerMode = createSelector(selectStatusState, fromStatus.getDrawerMode);

// project selectors
const selectProjectsState = createSelector(
  selectHomeState,
  (state: HomeState) => state.projects
);
export const allProjects = selectProjectsState;
export const activeProjects = createSelector(
  selectProjectsState,
  fromProjects.getActiveProjects
);
export const completedProjects = createSelector(
  selectProjectsState,
  fromProjects.getCompletedProjects
);
export const currentProject = createSelector(
  [allProjects, currentProjectId],
  (projects, id) => {
    if (id !== 'new') {
      return projects.find(p => p.id === id);
    } else {
      return {id: 'new', title: '', completed: false, notes: ''};
    }
  }
);
export const todoIds = createSelector(
  [currentProject],
  project => project ? project.todoIds : []
);

// todoItem selectors
const selectTodosState = createSelector(
  selectHomeState,
  (state: HomeState) => state.todos
);
export const allTodos = selectTodosState;
export const completedTodos = createSelector(
  allTodos,
  todos => {
    return todos.filter(todo => todo.completed);
  });
