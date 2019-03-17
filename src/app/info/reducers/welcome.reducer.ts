import { WelcomeActionsUnion, WelcomeActionTypes } from '../actions/welcome.actions';

export interface State {
  content: {} | null;
  updatedOn: number;
  error: any;
}

const initialState: State = {
  content: null,
  updatedOn: 0,
  error: '',
};

export function reducer(
  state = initialState,
  action: WelcomeActionsUnion
): State {
  switch (action.type) {
    case WelcomeActionTypes.GetContent: {
      return {
        ...state,
        error: '',
      };
    }

    case WelcomeActionTypes.GetContentSuccess: {
      return {
        ...state,
        content: action.payload,
        updatedOn: Date.now(),
        error: '',
      };
    }
    case WelcomeActionTypes.GetContentFailure: {
      return {
        ...state,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getContent = (state: State) => state.content;
export const getUpdateTime = (state: State) => state.updatedOn;
export const getError = (state: State) => state.error;
