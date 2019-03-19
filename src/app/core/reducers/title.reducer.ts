import { TitleActions } from '../actions';

export interface State {
  name: string;
}

const initialState: State = {
  name: 'MaThangs',
};

export function reducer(
  state: State = initialState,
  action: TitleActions.TitleActionUnion,
): State {
  switch (action.type) {
    case TitleActions.TitleActionTypes.SetTitle: {
      return {
        ...state,
        name: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getTitle = (state: State) => state.name;
