import validator from 'validator';
import { ILoginCredentials } from '../models';

export const validateisLoginCredentials = (credentials: ILoginCredentials):string | true =>  {
    if(!validator.isEmail(credentials.email)) return 'Email is not valid';
    if(validator.isLength(credentials.password,{min:8, max:20})) return 'Password must be between 8 and 20 characters long';

    return true
}