export type ErrorType = 'email' | 'password' |  'password2' | 'userName' | '';

export interface IAuthError {
  type:  ErrorType;
  message: string;
}