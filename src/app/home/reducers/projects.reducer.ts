import { Project } from '../../shared/models/project.model';
import { ProjectActions } from '../actions';

export interface State extends Array<Project> {
}

const initialState: State = [];

export function reducer(
  state = initialState,
  action: ProjectActions.ProjectActionsUnion
): State {
  switch (action.type) {
    case ProjectActions.ProjectActionTypes.SyncProjects: {
      return [
        ...action.payload,
      ];
    }
    case ProjectActions.ProjectActionTypes.ClearProjects: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const getActiveProjects = (state: State) => {
  return state.filter(project => !project.completed);
};
export const getCompletedProjects = (state: State) => {
  return state.filter(project => project.completed);
};
