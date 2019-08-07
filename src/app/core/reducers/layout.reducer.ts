import { LayoutActions } from '../actions';

export interface State {
  title: string;
  drawerOpened: boolean;
  drawerMode: string;
}

const initialState: State = {
  title: 'Thangs',
  drawerOpened: false,
  drawerMode: 'over'
};

export function reducer(
  state: State = initialState,
  action: LayoutActions.LayoutActionUnion,
): State {
  switch (action.type) {
    case LayoutActions.LayoutActionTypes.SetTitle: {
      return {
        ...state,
        title: action.payload,
      };
    }
    case LayoutActions.LayoutActionTypes.ToggleDrawer: {
      return {
        ...state,
        drawerOpened: !state.drawerOpened,
      };
    }
    case LayoutActions.LayoutActionTypes.SetDrawerOpened: {
      return {
        ...state,
        drawerOpened: action.payload,
      };
    }
    case LayoutActions.LayoutActionTypes.SetDrawerMode: {
      return {
        ...state,
        drawerMode: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getTitle = (state: State) => state.title;
export const shouldDrawerOpen = (state: State) => state.drawerMode === 'side' ? true : state.drawerOpened;
export const getDrawerMode = (state: State) => state.drawerMode;
