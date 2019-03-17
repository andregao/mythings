export interface UserDoc {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  signUpDate?: any;
  projectIds?: string[];
}

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
