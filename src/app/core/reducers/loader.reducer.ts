import { LoaderActionTypes, LoaderActionUnion } from '../actions/loader.actions';

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
  action: LoaderActionUnion
): State {
  switch (action.type) {
    case LoaderActionTypes.StartUpload: {
      return {
        ...state,
        isLoading: true,
        type: 'query',
      };
    }
    case LoaderActionTypes.StartDownload: {
      return {
        ...state,
        isLoading: true,
        type: 'indeterminate',
      };
    }
    case LoaderActionTypes.StopLoading: {
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
