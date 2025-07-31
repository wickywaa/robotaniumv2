import { ILoginCredentials } from "../models/auth/credentials";
import { AxiosResponse } from "axios";
import { ILoggedInUser } from "../models/User";
import { adminBaseAxios } from './Base.service';

export class AuthService {

  login = async (user: ILoginCredentials): Promise<ILoggedInUser | null | { unverified: boolean }> => {
    try {
      return adminBaseAxios.post<ILoggedInUser>('users/login',
        {
          email: user.email,
          password: user.password
        },
      ).then((response) => {
        return response.data
      })
    } catch (e) {

      throw new Error("user could not be signed in ");
    }
  };

  loginWithToken = async (): Promise<{ user: ILoggedInUser, token: string } | null> => {
    try {
      const response = (await adminBaseAxios.post<{ user: ILoggedInUser, token: string } | null>('authenticate'));
      if (response.status === 201 && response.data) return response.data;
      return null

    } catch (e) {
      return null
    }
  };

  logout = async (): Promise<AxiosResponse> => {

    try {
      return adminBaseAxios.post('users/logout')
    } catch (e) {
      throw new Error("user could not be signed in ");
    }
  };

}