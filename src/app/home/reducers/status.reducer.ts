import { StatusActions } from '../actions';

export interface State {
  needData: boolean;
  currentProjectId: string;
  drawerOpened: boolean;
  drawerMode: 'over' | 'side';
}

const initialState: State = {
  needData: true,
  currentProjectId: 'inbox',
  drawerOpened: true,
  drawerMode: 'side'
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
    case StatusActions.StatusActionTypes.ToggleDrawer: {
      return {
        ...state,
        drawerOpened: !state.drawerOpened,
      };
    }
    case StatusActions.StatusActionTypes.SetDrawerOpened: {
      return {
        ...state,
        drawerOpened: state.drawerMode === 'side' ? true : action.payload,
      };
    }
    case StatusActions.StatusActionTypes.SetHandsetMode: {
      return {
        ...state,
        drawerMode: action.payload ? 'over' : 'side',
      };
    }
    default: {
      return state;
    }
  }
}

export const getNeedData = (state: State) => state.needData;
export const getCurrentProjectId = (state: State) => state.currentProjectId;
export const getDrawerOpened = (state: State) => state.drawerOpened;
export const getDrawerMode = (state: State) => state.drawerMode;
