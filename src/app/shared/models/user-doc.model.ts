export interface UserDoc {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  signUpDate?: any;
  projectIds?: string[];
}
