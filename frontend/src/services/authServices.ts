import { AxiosResponse } from "axios";
import { UserCredential, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Auth } from "../firebase/firebase";
import { IConfirmEmailCredentials, IFirebaseUser, ILoggedInUser, ILoginCredentials, IRegisterCredentials } from "../models";
import { baseAxios } from './';

export class AuthService  {

  login = async (user: ILoginCredentials): Promise<{user:ILoggedInUser | null, token:string }> => {

    try {
        return baseAxios.post<{user: ILoggedInUser, token:string}>('users/login',
          {
            email: user.email,
            password: user.password
          },
        ).then((response)=>{
          return response.data
        })
    } catch (e) {
      
      throw new Error("user could not be signed in ");
    }
  };
  
  logout = async (): Promise<AxiosResponse> => {

    try {
        return baseAxios.post('users/logout')
    } catch (e) {
      throw new Error("user could not be signed in ");
    }
  };

  registerUser = async (credentials: IRegisterCredentials): Promise<boolean> => {
    return baseAxios.post('users/user',{
      email: credentials.email,
      username: credentials.userName,
      password: credentials.password
    })
  };

  confirmEmail = async (credentials: IConfirmEmailCredentials): Promise<{token:string, user: ILoggedInUser}> => {
    try {
        return baseAxios.post<{token:string, user: ILoggedInUser}>('users/confirm',
          {
            ...credentials
          },
        ).then((response)=>{
          return response.data
        })
    } catch (e) {
      throw new Error("Invalid");
    }
  };

  setResetPasswordToken = async (email:string): Promise<boolean> => {
    try {
         return baseAxios.post<boolean>('users/resetpassword',
          {
            email
          },
        ).then((response)=>{ 
          if(response.status !== 200) return false;
          return true
        })
    } catch (e) {
      throw new Error("Invalid");
    }
  };

  resendConfirmationCode = async (email:string): Promise<any> => {
    try {
      return baseAxios.post<boolean>('users/resendconfirmationcode',
        {
          email
        })
  } catch (e) {
    throw new Error("Invalid");
  }
  }

  loginWithToken = async (): Promise<{user:ILoggedInUser, token:string} | null> => {
    try {
      return baseAxios.post<{user:ILoggedInUser, token:string}>('users/authenticate').then((response)=>{
        return response.data
      })  
    } catch (e) {
      throw new Error("Invalid");
    }
  }
}

export const attachIdTokenToUser = async (): Promise<string | Error> => {
  try {
    const token = await Auth.currentUser?.getIdToken();
    if (token) return token;
    throw new Error("Cannot get Id token");
  } catch (e) {
    throw new Error("Cannot get Id token");
  }
};

export const registerUser = (email: string, password: string) => {
  try {
   return  createUserWithEmailAndPassword(Auth, email, password)
  } catch (e) {
    throw new Error("Cannot get Id token");
  }
}

export const addUserName = (userName:string) => {
  if(Auth.currentUser)  {
    return updateProfile(Auth.currentUser,{displayName:userName})
  }
}

export const  transformToFirebaseUser = (user: UserCredential) => {

  const newUser: IFirebaseUser = {
    displayName: user.user.displayName || "",
    phoneNumber: "",
    email: user.user.email || "",
    photoURL: "",
    providerId: "",
    uid: user.user.uid,
    emailVerified : false,
    idToken: user.user.displayName || "",
  };

  return newUser;

}