import axios, {AxiosInstance, AxiosError} from "axios";
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
        const tpken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (tpken && config.headers){
            config.headers.Authorization = `Bearer ${tpken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
        }
        const message = (error.response?.data as any)?.message || error.message || 'Something went wrong';
        console.error('API Error:', message);

        return Promise.reject(
            {
                message, 
                status: error.response?.status,
                data: error.response?.data
            }
        );
    }
);
export default api;