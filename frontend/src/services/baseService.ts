import axios from 'axios';


const token = `Bearer ${localStorage.getItem('authToken')}`
export const baseAxios = axios.create({
  baseURL: '/api/v2',
  headers: {
      'Authorization': token,
  }
});

baseAxios.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('authToken')
  return config;
})