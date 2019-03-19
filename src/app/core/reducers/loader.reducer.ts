import { LoaderActions } from '../actions';

export interface State {
  isLoading: boolean;
  type: 'indeterminate' | 'query';
}

const initialState: State = {
  isLoading: true,
  type: 'indeterminate',
};

export function reducer(
  state: State = initialState,
  action: LoaderActions.LoaderActionUnion
): State {
  switch (action.type) {
    case LoaderActions.LoaderActionTypes.StartUpload: {
      return {
        ...state,
        isLoading: true,
        type: 'query',
      };
    }
    case LoaderActions.LoaderActionTypes.StartDownload: {
      return {
        ...state,
        isLoading: true,
        type: 'indeterminate',
      };
    }
    case LoaderActions.LoaderActionTypes.StopLoading: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default: {
      return state;
    }

  }
}

export const getIsLoading = (state: State) => state.isLoading;
export const getLoaderType = (state: State) => state.type;
