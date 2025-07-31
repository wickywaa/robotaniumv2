export interface ILoginCredentials {
  email: string;
  password: string;
  token?:string;
}

export interface IRegisterCredentials {
  userName?: string;
  email: string;
  password: string;
}

export interface IConfirmEmailCredentials {
  email: string;
  registrationToken: string;
}

export interface IAuthErrors {
  id: number;
  message: string;
}