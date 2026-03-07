import axios, { type AxiosInstance } from 'axios';
import { API_TIMEOUT, BASE_URL } from './const';

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const getData = <T>(url: string,params?:any) => axiosClient.get<T>(url,{params}) as Promise<T>
export const deleteDataNoBody = <T>(url: string,params?:any) => axiosClient.delete<T>(url,{params}) as Promise<T>
export const deleteData = <T>(url: string, body: any) => 
  axiosClient.delete<T>(url, body) as Promise<T>
export const postData = <T>(url: string, body: any) => 
  axiosClient.post<T>(url, body) as Promise<T>

export const putData = <T>(url: string, body: any) => 
  axiosClient.put<T>(url, body) as Promise<T>


export default axiosClient;