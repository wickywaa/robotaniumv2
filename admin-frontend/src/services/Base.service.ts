import axios, { AxiosResponse } from 'axios';
import { store } from '../store/store';
import { authSlice } from '../store/slices/'

const token = `Bearer ${localStorage.getItem('authToken')}`

export const adminBaseAxios = axios.create({
  baseURL: '/api/v2',
  headers: {
      'Authorization': token,
  }
});

adminBaseAxios.interceptors.request.use(function (config:any) {
  config.headers.Authorization = localStorage.getItem('authToken')
  return config;
})

adminBaseAxios.interceptors.response.use(function(response:AxiosResponse){

  if(response.status === 401) {
    window.location.href = '/admin/login'
    console.log('the user is invalid and should be signed out' )
  }
  console.log('here is the response',response.status === 401)
  return response
})