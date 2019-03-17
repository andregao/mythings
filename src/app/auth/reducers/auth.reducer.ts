import { UserDoc } from '../../shared/models/user.model';
import { AuthActions, AuthApiActions, AuthPageActions } from '../actions';


export interface State {
  user: UserDoc | null;
  error: any;
}

const initialState: State = {
  user: null,
  error: '',
};

export function reducer(
  state = initialState,
  action: AuthApiActions.AuthApiActionsUnion | AuthActions.AuthActionsUnion | AuthPageActions.AuthPageActionsUnion
): State {
  switch (action.type) {

    case AuthActions.AuthActionTypes.GetUserDataSuccess: {
      return {
        ...state,
        user: action.payload,
        error: '',
      };
    }
    case AuthPageActions.AuthPageActionTypes.SignIn: {
      return {
        ...state,
        error: '',
      };
    }
    case AuthPageActions.AuthPageActionTypes.SignUp: {
      return {
        ...state,
        error: '',
      };
    }
    case AuthPageActions.AuthPageActionTypes.GoogleSignIn: {
      return {
        ...state,
        error: '',
      };
    }
    case AuthApiActions.AuthApiActionTypes.SignInFailure: {
      return {
        ...state,
        user: null,
        error: getErrorMessage(action.payload),
      };
    }

    case AuthApiActions.AuthApiActionTypes.SignUpFailure: {
      return {
        ...state,
        user: null,
        error: getErrorMessage(action.payload),
      };
    }
    case AuthActions.AuthActionTypes.SignOutSuccess: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export const getUser = (state: State) => state.user;
export const getError = (state: State) => state.error;

function getErrorMessage(error): string {
  console.log('got error code:', error);
  switch (error) {
    // sign in errors
    case 'auth/wrong-password':
      return 'Wrong password';
    case 'auth/user-not-found':
      return 'User does not exist';
    case 'auth/invalid-email':
      return 'Invalid email address';

    // sign up errors
    case 'auth/email-already-in-use':
      return 'User already exist';
    case 'auth/weak-password':
      return 'Password is too simple';

    // redirect errors
    case 'auth/operation-not-allowed':
      return 'Account has been disabled';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Browser protocol not supported, accepts only "http" and "https"';

    default:
      return error;
  }
}
