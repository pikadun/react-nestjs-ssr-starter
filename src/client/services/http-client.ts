import axios from "axios";

export const httpClient = axios.create();

httpClient.interceptors.request.use((config) => {
    config.baseURL = window.__APP__.basePath;
    return config;
});
