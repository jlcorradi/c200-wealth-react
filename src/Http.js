import axios from "axios";
import { NotificationManager } from 'react-notifications';
import { Auth } from "./Auth";

export const http = axios;

// Add a request interceptor
http.interceptors.request.use(function (config) {
    if (Auth.isValidSession()) {
        config.headers["Authorization"] = "Bearer " + Auth.getToken()
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a request interceptor
http.interceptors.response.use(function (response) {
    notify(response.headers);
    return response;
}, function (error) {
    // Do something with request error
    let errorMsg = error.response.data.error;
    if (errorMsg) {
        NotificationManager.error(errorMsg);
    }
    return Promise.reject(error);
});

const notify = headers => {
    if (headers['x-message-success']) {
        NotificationManager.success(headers['x-message-success'])
    }

    if (headers['x-message-info']) {
        NotificationManager.info(headers['x-message-info'])
    }

    if (headers['x-message-warning']) {
        NotificationManager.warning(headers['x-message-warning'])
    }
}
