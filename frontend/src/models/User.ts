export interface ILoggedInUser {
  id: string,
  email: string,
  isRobotaniumAdmin: boolean,
  isPlayerAdmin: boolean,
  userName: string,
  imgsrc: string,
  isActive: boolean,
  isEmailVerified: boolean,
  changePassword: false,
  rememberme: false,
  theme: string,
}