export interface ILoggedInUser {
  _id: string,
  email: string,
  isRobotaniumAdmin: boolean,
  isPlayerAdmin: boolean,
  userName: string,
  imgsrc: string,
  isActive: boolean,
  isEmailVerified: boolean,
  changePassword: boolean,
  rememberme: false,
  theme: string,
}

export const emptyUser:  ILoggedInUser = {
  _id: '',
  email: '',
  isRobotaniumAdmin: false,
  isPlayerAdmin: false,
  userName: '',
  imgsrc: '',
  isActive: true,
  isEmailVerified:true,
  changePassword: false,
  rememberme: false,
  theme: '',
}

export interface IEditUser extends ILoggedInUser {
  password: string;
}

export type UserType = "player" | "admin"