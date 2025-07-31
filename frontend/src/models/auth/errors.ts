type ErrorType = 'email' | 'password' |  'password2' | 'userName' | '';

interface IAuthError {
  type:  ErrorType;
  message: string;
}
