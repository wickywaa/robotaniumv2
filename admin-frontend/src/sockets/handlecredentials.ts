
import {store} from '../store/store';
import { setCredentials } from '../store/slices';
import {IRTCCredentials } from '../models';

export const handleRTCCredentials = (message: IRTCCredentials[]) => {

  console.log('credentials', message)
  store.dispatch(setCredentials(message))
}