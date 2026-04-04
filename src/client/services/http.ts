import axios from "axios";

const resolveBaseURL = () => {
    if (typeof document === "undefined") {
        return "/";
    }

    const baseElement = document.querySelector("base");

    return baseElement?.getAttribute("href") ?? "/";
};

export const httpClient = axios.create({
    baseURL: resolveBaseURL(),
});
