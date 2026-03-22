import { HttpClient } from "@shared/http/http-client";
import type { ListTodosResponse } from "@shared/schemas/todo.schema";

const baseElement = document.querySelector("base");
const baseURL = baseElement?.getAttribute("href") ?? "/";
const httpClient = new HttpClient({ baseURL });

export const getList = async () => {
    return httpClient.get<ListTodosResponse>("/api/todo");
};
