import axios, { AxiosInstance, AxiosError} from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token =  typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        
    }
)