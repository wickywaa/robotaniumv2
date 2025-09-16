import { useMutation, } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { ILoginCredentials } from '../models';
import { validateisLoginCredentials } from '../services';
import { AuthService } from '../services/authServices';


export function useAuthMutations(){
  
const authService = new AuthService();
  const { login, logout} = useAuth();

   const loginMutation = useMutation({
     mutationFn: (login: ILoginCredentials) => {
      const isValidLogin = validateisLoginCredentials(login);
      if (!isValidLogin) throw new Error(typeof isValidLogin === 'string' ? isValidLogin : 'Invalid credentials');
      const response = authService.login(login)
      return response
     },
     onSuccess:(data) => {
      console.log('tokenstuff', data)
      login(data.user, data.token)
     }, 
     onError: () => {
      logout()
     }
   }
  );

  return { loginMutation };

}
