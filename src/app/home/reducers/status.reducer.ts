import { StatusActions } from '../actions';

export interface State {
  needData: boolean;
  currentProjectId: string;
}

const initialState: State = {
  needData: true,
  currentProjectId: 'inbox',
};

export function reducer(
  state = initialState,
  action: StatusActions.StatusActionsUnion,
): State {
  switch (action.type) {
    case StatusActions.StatusActionTypes.SetNeedData: {
      return {
        ...state,
        needData: action.payload,
      };
    }
    case StatusActions.StatusActionTypes.SetCurrentProject: {
      return {
        ...state,
        currentProjectId: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getNeedData = (state: State) => state.needData;
export const getCurrentProjectId = (state: State) => state.currentProjectId;
