import { Axios, type AxiosRequestConfig, type AxiosResponse } from "axios";

export type HttpClientOptions = Pick<AxiosRequestConfig, "baseURL">;

export interface HttpErrorInfo {
    message: string;
    details?: string;
}

export class HttpError extends Error {
    details?: string;

    constructor(info: HttpErrorInfo) {
        super(info.message);
        this.name = HttpError.name;
        this.details = info.details;
    }
}

export class HttpClient {
    #axios: Axios;

    constructor(options: HttpClientOptions) {
        this.#axios = new Axios(options);

        this.#axios.interceptors.request.use((config) => {
            return config;
        });

        this.#axios.interceptors.response.use((res) => {
            return res.data as AxiosResponse<unknown>;
        }, (error: unknown) => {
            if (error instanceof Error) {
                throw new HttpError({ message: error.message });
            }

            throw new HttpError({ message: "An unknown error occurred.", details: JSON.stringify(error) });
        });
    }

    async get<T>(url: string) {
        return this.#axios.get<unknown, T>(url);
    }
}
