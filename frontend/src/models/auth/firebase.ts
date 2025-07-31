import { UserInfo } from 'firebase/auth'

export interface IFirebaseUser extends UserInfo {
  emailVerified : boolean;
   idToken: string;
}