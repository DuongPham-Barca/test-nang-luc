import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import Cookies from 'js-cookie';
// import NProgress from 'nprogress';

// NProgress.configure({
//     showSpinner: false,
//     trickleSpeed: 100,
// });


//set config defaults when creating the instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
}) as AxiosInstance;

// Add global request interceptor
instance.interceptors.request.use(

    (config: InternalAxiosRequestConfig) => {
        // NProgress.start();
        const token = window.localStorage.getItem("access_token") || Cookies.get("access_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Modify request config here, e.g., add headers
        return config;
    },
    (error: AxiosError) => {
        // NProgress.done();

        return Promise.reject(error);
    }
);

// Add global response interceptor
instance.interceptors.response.use(

    (response: AxiosResponse) => {
        // NProgress.done();
        // console.log(response)
        // if (response.data && response.data.data) return response.data
        // Modify response data here, if needed
        return response;
    },
    (error: AxiosError) => {
        // // NProgress.done();

        // if (error.response && error.response.data) return error.response.data;
        return Promise.reject(error);
    }
);


//after defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
export default instance